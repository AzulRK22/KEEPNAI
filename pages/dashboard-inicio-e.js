// pages/dashboard-inicio-e.js

import React, { useState, useEffect } from 'react';
import { Box, Typography, InputBase, IconButton } from "@mui/material";
import Sidebar from "../components/Sidebar";
import styles from "../components/Dashboard.module.css";
import Notification from "../components/Notifications";
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
            <iframe
              src="https://www.globalforestwatch.org/embed/map/country/CHL/?category=fires&mainMap=eyJzaG93QW5hbHlzaXMiOnRydWV9&map=eyJjZW50ZXIiOnsibGF0IjotMzkuMzE5OTkyNjQwODE2ODM1LCJsbmciOi04Ny45MzAwMjMxOTQ5NzI3Mn0sInpvb20iOjMuMjg4NTM4MzQ5NjY1ODY2LCJjYW5Cb3VuZCI6ZmFsc2UsImRhdGFzZXRzIjpbeyJkYXRhc2V0IjoicG9saXRpY2FsLWJvdW5kYXJpZXMiLCJsYXllcnMiOlsiZGlzcHV0ZWQtcG9saXRpY2FsLWJvdW5kYXJpZXMiLCJwb2xpdGljYWwtYm91bmRhcmllcyJdLCJib3VuZGFyeSI6dHJ1ZSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX0seyJkYXRhc2V0IjoiZmlyZS1hbGVydHMtdmlpcnMiLCJsYXllcnMiOlsiZmlyZS1hbGVydHMtdmlpcnMiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwicGFyYW1zIjp7InZpc2liaWxpdHkiOnRydWUsImFkbV9sZXZlbCI6ImFkbTAifSwidGltZWxpbmVQYXJhbXMiOnsic3RhcnREYXRlQWJzb2x1dGUiOiIyMDI0LTA1LTEyIiwiZW5kRGF0ZUFic29sdXRlIjoiMjAyNC0wOC0xMCIsInN0YXJ0RGF0ZSI6IjIwMjQtMDUtMTIiLCJlbmREYXRlIjoiMjAyNC0wOC0xMCIsInRyaW1FbmREYXRlIjoiMjAyNC0wOC0xMCJ9fV19"
              width="100%"
              height="500px"
              style={{ border: 'none', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}
            ></iframe>
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





