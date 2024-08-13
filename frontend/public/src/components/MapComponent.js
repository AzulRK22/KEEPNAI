// components/MapComponent.js

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Configura la posición inicial del mapa en Chile
const position = [-33.4489, -70.6693]; // Coordenadas para Santiago, Chile

const MapComponent = () => {
  return (
    <MapContainer center={position} zoom={6} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

    </MapContainer>
  );
};

export default MapComponent;
