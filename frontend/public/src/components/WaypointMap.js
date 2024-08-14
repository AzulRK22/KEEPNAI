import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WaypointMap = () => {
  const [waypoints, setWaypoints] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/generate_waypoints')
      .then(response => {
        setWaypoints(response.data.waypoints);
      })
      .catch(error => console.error('Error fetching waypoints:', error));
  }, []);

  return (
    <div>
      <h1>Waypoint Visualizer</h1>
      <MapContainer
        center={[-33.0472, -71.6127]}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {waypoints.length > 0 && (
          <>
            <Marker position={waypoints[0]} />
            <Polyline positions={waypoints} color="blue" />
          </>
        )}
      </MapContainer>
      <h2>Waypoints</h2>
      <ul>
        {waypoints.map((wp, index) => (
          <li key={index}>
            {index + 1}: Latitude: {wp[0]}, Longitude: {wp[1]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WaypointMap;
