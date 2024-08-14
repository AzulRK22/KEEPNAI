from flask import Blueprint, request, jsonify
from flask_cors import CORS
import math
from pyproj import Geod


app = Flask(__name__)
CORS(app)

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

@app.route('/api/generate_waypoints', methods=['POST'])
def generate_waypoints_endpoint():
    data = request.get_json()
    lat = data.get('lat')
    lng = data.get('lng')
    
    # You might want to validate the data here

    start_coord = (lat, lng)
    flight_time = 25  # Example value
    speed = 10        # Example value
    vision_range = 200  # Example value
    
    waypoints = generate_centered_search_waypoints(start_coord, flight_time, speed, vision_range)
    
    return jsonify(waypoints)
@app.route('/')
def hello_world():
    return 'Hellossdfsddfsdfff, World!'

if __name__ == '__main__':
    app.run(debug=True)

