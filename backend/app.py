from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from models.models import db, Mission, Coordinate, ImageData
from models.seed import seed_database
from werkzeug.utils import secure_filename
import os
import math
from pyproj import Geod
from datetime import datetime
#import openai

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)
with app.app_context():
    db.create_all()
    #seed_database(app)

@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        new_image_data = ImageData(
            filename=filename,
            latitude=float(request.form['latitude']),
            longitude=float(request.form['longitude']),
            classification=request.form['classification']
        )
        db.session.add(new_image_data)
        db.session.commit()

        return jsonify({"message": "Image uploaded successfully", "id": new_image_data.id}), 201

@app.route('/image_data', methods=['GET'])
def get_image_data():
    images = ImageData.query.all()
    return jsonify([{
        "id": img.id,
        "filename": img.filename,
        "latitude": img.latitude,
        "longitude": img.longitude,
        "classification": img.classification,
        "timestamp": img.timestamp.isoformat()
    } for img in images])

@app.route('/image/<int:image_id>', methods=['GET'])
def get_image(image_id):
    image_data = ImageData.query.get_or_404(image_id)
    return send_from_directory(app.config['UPLOAD_FOLDER'], image_data.filename)



# WGS84 ellipsoid
geod = Geod(ellps="WGS84")

def generate_centered_search_waypoints(start_coord, flight_time, speed, vision_range, overlap=0.2):
    waypoints = [start_coord]
    start_lat, start_lon = start_coord
    lane_spacing = 2 * vision_range * (1 - overlap)
    max_distance = flight_time * 60 * speed * 0.9  # 90% of max distance for safety
    num_lanes = int(math.sqrt(max_distance / (4 * lane_spacing)))  # Adjusting for square shape
    line_length = max_distance / (2 * num_lanes)

    for i in range(-num_lanes, num_lanes + 1):
        current_lat = start_lat + (i * lane_spacing) / 111111  # Convert meters to degrees latitude
        if i % 2 == 0:  # Even lanes go west to east
            west_lon = start_lon - (line_length / 2) / (111111 * math.cos(math.radians(current_lat)))
            east_lon = start_lon + (line_length / 2) / (111111 * math.cos(math.radians(current_lat)))
            waypoints.append((current_lat, west_lon))
            waypoints.append((current_lat, east_lon))
        else:  # Odd lanes go east to west
            east_lon = start_lon + (line_length / 2) / (111111 * math.cos(math.radians(current_lat)))
            west_lon = start_lon - (line_length / 2) / (111111 * math.cos(math.radians(current_lat)))
            waypoints.append((current_lat, east_lon))
            waypoints.append((current_lat, west_lon))
    waypoints.append(start_coord)
    return waypoints

@app.route('/generate_waypoints', methods=['POST', 'GET'])
def generate_waypoints_endpoint():
    if request.method == 'POST':
        data = request.get_json()
        lat = data.get('lat')
        lng = data.get('lng')

        try:
            # Save the coordinates to the database
            new_coordinate = Coordinate(latitude=lat, longitude=lng)
            db.session.add(new_coordinate)
            db.session.commit()
            print(f"Coordinate saved: {lat}, {lng}")
        except Exception as e:
            db.session.rollback()
            print(f"Error saving coordinate: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
    else:  # GET request
        lat, lng = -33.0472, -71.6127  # Default coordinates for GET requests

    # Validate input
    if lat is None or lng is None:
        return jsonify({"error": "Invalid input", "waypoints": []}), 400

    start_coord = (lat, lng)
    flight_time = 25  # Example value
    speed = 10        # Example value
    vision_range = 200  # Example value
    
    waypoints = generate_centered_search_waypoints(start_coord, flight_time, speed, vision_range)
    
    return jsonify({"waypoints": waypoints})


# Route to create a new coordinate
@app.route('/create_coordinate', methods=['POST'])
def create_coordinate():
    data = request.json
    new_coordinate = Coordinate(
        latitude=data['latitude'],
        longitude=data['longitude'],
        mission_id=data.get('mission_id')  # This will be None if not provided
    )
    db.session.add(new_coordinate)
    db.session.commit()
    return jsonify({"message": "Coordinate created successfully", "coordinate_id": new_coordinate.id}), 201

# Route to get all coordinates
@app.route('/coordinates', methods=['GET'])
def get_coordinates():
    coordinates = Coordinate.query.all()
    return jsonify([{
        "id": coord.id,
        "latitude": coord.latitude,
        "longitude": coord.longitude,
        "mission_id": coord.mission_id
    } for coord in coordinates])

# New route to create a mission
@app.route('/create_mission', methods=['POST'])
def create_mission():
    data = request.json
    new_mission = Mission(
        name=data['name'],
        schedule=datetime.fromisoformat(data['schedule']),
        priority_score=data['priority_score'],
        mode=data['mode'],
        overlap_pct=data['overlap_pct'],
        vision_range=data['vision_range'],
        speed=data['speed'],
        flight_time=data['flight_time']
    )
    db.session.add(new_mission)

    for coord in data['coordinates']:
        new_coordinate = Coordinate(latitude=coord['lat'], longitude=coord['lng'], mission=new_mission)
        db.session.add(new_coordinate)

    db.session.commit()
    return jsonify({"message": "Mission created successfully", "mission_id": new_mission.id}), 201

# Route to get all missions
@app.route('/missions', methods=['GET'])
def get_missions():
    missions = Mission.query.all()
    return jsonify([{
        "id": mission.id,
        "name": mission.name,
        "schedule": mission.schedule.isoformat(),
        "priority_score": mission.priority_score,
        "mode": mission.mode,
        "overlap_pct": mission.overlap_pct,
        "vision_range": mission.vision_range,
        "speed": mission.speed,
        "flight_time": mission.flight_time,
        "coordinates": [{"lat": coord.latitude, "lng": coord.longitude} for coord in mission.coordinates]
    } for mission in missions])

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')

    # Make a request to OpenAI's API
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": user_message}]
        )
        bot_message = response.choices[0].message['content']
        return jsonify({'message': bot_message})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def hello_world():
    return 'dsf, World!'

if __name__ == '__main__':
    app.run(debug=True)