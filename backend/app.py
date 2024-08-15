from flask import Blueprint, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import math
from pyproj import Geod
from flask import Flask, request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename
from datetime import datetime



app = Flask(__name__)
CORS(app)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'coordinates.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Mission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    schedule = db.Column(db.DateTime, nullable=False)
    priority_score = db.Column(db.Float, nullable=False)
    mode = db.Column(db.String(50), nullable=False)
    overlap_pct = db.Column(db.Float, nullable=False)
    vision_range = db.Column(db.Float, nullable=False)
    speed = db.Column(db.Float, nullable=False)
    flight_time = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relationship with Coordinate
    coordinates = db.relationship('Coordinate', back_populates='mission', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Mission {self.name}>'

class Coordinate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    mission_id = db.Column(db.Integer, db.ForeignKey('mission.id'), nullable=True)  # Changed to nullable

    # Relationship with Mission
    mission = db.relationship('Mission', back_populates='coordinates')

    def __repr__(self):
        return f'<Coordinate {self.latitude}, {self.longitude}>'
    

def seed_database():
    if Mission.query.count() == 0 and Coordinate.query.count() == 0:
        # Create a sample mission
        sample_mission = Mission(
            name="Sample Mission",
            schedule=datetime.utcnow(),
            priority_score=0.8,
            mode="standard",
            overlap_pct=0.2,
            vision_range=200,
            speed=10,
            flight_time=25
        )
        db.session.add(sample_mission)

        # Create sample coordinates associated with the mission
        sample_coordinates = [
            {"latitude": -33.0472, "longitude": -71.6127},
            {"latitude": 40.7128, "longitude": -74.0060},
            {"latitude": 51.5074, "longitude": -0.1278},
        ]
        for coord in sample_coordinates:
            new_coordinate = Coordinate(**coord, mission=sample_mission)
            db.session.add(new_coordinate)
        
        # Create sample coordinates not associated with any mission
        independent_coordinates = [
            {"latitude": 35.6762, "longitude": 139.6503},
            {"latitude": -33.8688, "longitude": 151.2093}
        ]
        for coord in independent_coordinates:
            new_coordinate = Coordinate(**coord)
            db.session.add(new_coordinate)
        
        db.session.commit()
        print("Database seeded successfully!")
    else:
        print("Database already contains data, skipping seed.")



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

@app.route('/generate_waypoints', methods=['POST'])
def generate_waypoints_endpoint():
    if request.method == 'POST':
        data = request.get_json()
        lat = data.get('lat')
        lng = data.get('lng')

        # Save the coordinates to the database
        new_coordinate = Coordinate(latitude=lat, longitude=lng)
        db.session.add(new_coordinate)
        db.session.commit()
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

# Create the database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)

