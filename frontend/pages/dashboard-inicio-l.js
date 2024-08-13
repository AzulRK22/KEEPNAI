// pages/dashboard-inicio-l.js

import React, { useState, useEffect } from 'react';
import Map from '../public/src/components/Map';
import 'leaflet/dist/leaflet.css'; // Importar estilos de Leaflet
import { Box, Typography, InputBase, IconButton, CircularProgress } from "@mui/material";
import Sidebar2 from "../public/src/components/Sidebar2";
import styles from "../public/src/components/Dashboard.module.css";
import { getWeatherData } from '../public/src/services/api'; // Función para obtener datos del clima
import { getSafetyRecommendations } from '../public/src/services/openai'; // Función para obtener recomendaciones

const DashboardInicioL = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weather = await getWeatherData();
        setWeatherData(weather);

        const safetyRecommendations = await getSafetyRecommendations(weather);
        setRecommendations(safetyRecommendations);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar2 />
      <div className={styles.content}>
        <Box className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.searchBar}>
              <IconButton aria-label="search" className={styles.searchIcon}>
                <img src="/icons/lupa.svg" alt="Search Icon" />
              </IconButton>
              <InputBase
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
                sx={{ marginLeft: 2, flex: 1 }}
              />
            </div>
            <div className={styles.icons}>
              <IconButton aria-label="light-mode">
                <img src="/icons/IconSet.svg" alt="Light Mode Icon" />
              </IconButton>
              <IconButton aria-label="notifications">
                <img src="/icons/Bell.svg" alt="Notifications Icon" />
              </IconButton>
            </div>
          </div>

          <Typography variant="h4" gutterBottom>
            Inicio
          </Typography>

          {/* Condiciones Meteorológicas Locales */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              Condiciones Meteorológicas Locales
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : weatherData ? (
              <Box>
                <Typography>Temperatura: {weatherData.temperature}°C</Typography>
                <Typography>Velocidad del viento: {weatherData.windSpeed} km/h</Typography>
                <Typography>Dirección del viento: {weatherData.windDirection}°</Typography>
                <Typography>Humedad: {weatherData.humidity}%</Typography>
              </Box>
            ) : (
              <Typography>No se pudieron obtener los datos meteorológicos.</Typography>
            )}
          </Box>

          {/* Recomendaciones de Seguridad */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Recomendaciones de Seguridad
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : recommendations ? (
              <Box>
                <Typography>{recommendations}</Typography>
              </Box>
            ) : (
              <Typography>No se pudieron obtener las recomendaciones de seguridad.</Typography>
            )}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default DashboardInicioL;


