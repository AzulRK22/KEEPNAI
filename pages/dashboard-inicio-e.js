import React, { useState } from 'react';
import { Box, Typography, InputBase, IconButton, Snackbar, Alert } from "@mui/material";
import Sidebar from "../components/Sidebar";
import 'leaflet/dist/leaflet.css'; // Importar estilos de Leaflet
import styles from "../components/Dashboard.module.css";
import Notification from "../components/Notifications";
import Map from '../components/Map'; // Importa el componente del mapa

const DashboardInicioE = () => {
  const [showNotification, setShowNotification] = useState(false);

  const handleNotificationClick = () => {
    setShowNotification(true);
  };
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent}>
          {/* Notificación solo se muestra al hacer clic en el ícono */}
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
        </Box>
      </div>
    </div>
  );
};

export default DashboardInicioE;
