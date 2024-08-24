import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Utiliza dynamic para cargar el componente de Leaflet solo en el cliente
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const L = dynamic(() => import('leaflet'), { ssr: false });

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/results/results_log.csv', { responseType: 'text' });
        const responseText = response.data;
        const rows = responseText.split('\n').slice(1); // Omite la primera fila (cabeceras)
    
        const data = rows
          .filter(row => row.trim() !== '') // Filtra filas vacías
          .map(row => {
            const [imagePath, lat, lon] = row.split(',');
            return { imagePath, lat: parseFloat(lat), lon: parseFloat(lon) };
          });
    
        setMarkers(data);
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (map && L) {
      markers.forEach(({ lat, lon, imagePath }) => {
        const icon = L.divIcon({
          className: 'custom-icon',
          html: `<img src="${imagePath}" style="width: 100px; height: 75px;"/>`,
          iconSize: [100, 75],
        });

        L.marker([lat, lon], { icon }).addTo(map);
      });
    }
  }, [map, markers]);

  return (
    <MapContainer
      center={[-33.4489, -70.6693]} // Ajusta al centro predeterminado
      zoom={6}
      style={{ height: '400px', width: '100%' }}
      whenCreated={setMap}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
};

export default MapComponent;


