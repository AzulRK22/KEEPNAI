import React, { useState, useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DraggablePin = ({ position, onDragEnd }) => {
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          onDragEnd(marker.getLatLng());
        }
      },
    }),
    [onDragEnd],
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })}
    >
      <Popup>Drag me to select a location!</Popup>
    </Marker>
  );
};

const WaypointMap = () => {
  const [waypoints, setWaypoints] = useState([]);
  const [pinPosition, setPinPosition] = useState([-33.0472, -71.6127]);

  const handlePinDragEnd = (newPosition) => {
    setPinPosition([newPosition.lat, newPosition.lng]);
    axios.post('http://localhost:5000/generate_waypoints', { lat: newPosition.lat, lng: newPosition.lng })
      .then(response => {
        if (Array.isArray(response.data.waypoints)) {
          setWaypoints(response.data.waypoints);
        } else {
          console.error('Unexpected response format:', response.data);
          setWaypoints([]);
        }
      })
      .catch(error => {
        console.error('Error sending waypoint:', error);
        setWaypoints([]);
      });
  };

  useEffect(() => {
    axios.get('http://localhost:5000/generate_waypoints')
      .then(response => {
        if (Array.isArray(response.data.waypoints)) {
          setWaypoints(response.data.waypoints);
        } else {
          console.error('Unexpected response format:', response.data);
          setWaypoints([]);
        }
      })
      .catch(error => {
        console.error('Error fetching waypoints:', error);
        setWaypoints([]);
      });
  }, []);

  return (
    <div>
      <h1>Waypoint Visualizer</h1>
      <MapContainer
        center={pinPosition}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains='abcd'
          maxZoom={20}
        />
        <DraggablePin position={pinPosition} onDragEnd={handlePinDragEnd} />
        {Array.isArray(waypoints) && waypoints.length > 0 && (
          <Polyline positions={waypoints} color="blue" />
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