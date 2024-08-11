// pages/dashboard-inicio-e.js

import React, { useState, useEffect } from 'react';
import { Box, Typography, InputBase, IconButton } from "@mui/material";
import Sidebar from "../components/Sidebar";
import 'leaflet/dist/leaflet.css'; // Importar estilos de Leaflet
import styles from "../components/Dashboard.module.css";
import Notification from "../components/Notifications";
import Map from '../components/Map'; // Importa el componente del mapa
import { getWeatherData } from '../services/api'; // Importa la función que obtiene datos

const DashboardInicioE = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [fireSummary, setFireSummary] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const weather = await getWeatherData();
      setWeatherData(weather);
    };

    fetchData();
  }, []);

  const handleNotificationClick = () => {
    setShowNotification(true);
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent}>
          <Notification
            type="success"
            title="Inicio Exitoso"
            message="Has ingresado exitosamente al panel de emergencia."
            show={showNotification}
          />
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
              <IconButton
                aria-label="notifications"
                onClick={handleNotificationClick}
                className={showNotification ? "" : styles.notificationIcon}
              >
                <img src="/icons/Bell.svg" alt="Notifications Icon" />
              </IconButton>
            </div>
          </div>

          <Typography variant="h4" gutterBottom>
            Inicio
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Map />
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Resumen de Incidentes
            </Typography>
            {fireSummary ? (
              <Box>
                <Typography>Cantidad de incendios: {fireSummary.count}</Typography>
                <Typography>Áreas afectadas: {fireSummary.areas}</Typography>
              </Box>
            ) : (
              <Typography>Cargando datos de incendios...</Typography>
            )}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Condiciones Meteorológicas
            </Typography>
            {weatherData ? (
              <Box>
                <Typography>Temperatura: {weatherData.main.temp}°C</Typography>
                <Typography>Velocidad del viento: {weatherData.wind.speed} m/s</Typography>
                <Typography>Dirección del viento: {weatherData.wind.deg}°</Typography>
                <Typography>Humedad: {weatherData.main.humidity}%</Typography>
              </Box>
            ) : (
              <Typography>Cargando datos meteorológicos...</Typography>
            )}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default DashboardInicioE;



