import React, { useState } from "react";
import { Box, Typography, Button, Slider, Switch, FormControlLabel } from "@mui/material";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import DownloadIcon from '@mui/icons-material/Download';
import Sidebar from "../public/src/components/Sidebar";
import styles from "../public/src/components/Dashboard.module.css";
import WaypointMapWrapper from '../public/src/components/WaypointMapWrapper';

const DashboardIncidentesE = () => {
  const [altitude, setAltitude] = useState(50);
  const [speed, setSpeed] = useState(10);
  const [mode, setMode] = useState(false);
  const [visionRange, setVisionRange] = useState(100);
  const [flightTime, setFlightTime] = useState(20);
  const [isRouteCalculated, setIsRouteCalculated] = useState(false);

  const handleDownload = () => {
    if (isRouteCalculated) {
      console.log("Downloading WP File...");
      // Add your download logic here
    }
  };

  const handleCalculateRoute = () => {
    const config = {
      altitude,
      speed,
      mode: mode ? "Mode 2" : "Mode 1",
      visionRange,
      flightTime
    };
    console.log("Calculating route with config:", config);
    // Add your route calculation logic here
    
    // Simulate route calculation (replace with actual calculation)
    setTimeout(() => {
      setIsRouteCalculated(true);
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent}>
          <div className={styles.headerContent}>
            <Typography variant="h4" gutterBottom>
              Mapa con Rutas 
            </Typography>
          </div>
          <WaypointMapWrapper />
          
          <Box className={styles.configPanel}>
            <Typography variant="h6" gutterBottom>
              Drone Configuration
            </Typography>
            <Box className={styles.sliderContainer}>
              <Typography>Overlap: {altitude} %</Typography>
              <Slider
                value={altitude}
                onChange={(_, newValue) => setAltitude(newValue)}
                min={0}
                max={100}
              />
            </Box>
            <Box className={styles.sliderContainer}>
              <Typography>Speed: {speed} m/s</Typography>
              <Slider
                value={speed}
                onChange={(_, newValue) => setSpeed(newValue)}
                min={0}
                max={20}
              />
            </Box>
            <FormControlLabel
              control={<Switch checked={mode} onChange={(e) => setMode(e.target.checked)} />}
              label={mode ? "Altura Alta" : "Altura Baja"}
            />
            <Box className={styles.sliderContainer}>
              <Typography>Vision Range: {visionRange} m</Typography>
              <Slider
                value={visionRange}
                onChange={(_, newValue) => setVisionRange(newValue)}
                min={50}
                max={500}
              />
            </Box>
            <Box className={styles.sliderContainer}>
              <Typography>Flight Time: {flightTime} min</Typography>
              <Slider
                value={flightTime}
                onChange={(_, newValue) => setFlightTime(newValue)}
                min={5}
                max={60}
              />
            </Box>
            <Box className={styles.buttonContainer}>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleCalculateRoute}
                className={styles.calculateButton}
                startIcon={<FlightTakeoffIcon />}
              >
                Generate Flight Path
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleDownload}
                className={`${styles.downloadButton} ${!isRouteCalculated && styles.disabledButton}`}
                startIcon={<DownloadIcon />}
                disabled={!isRouteCalculated}
              >
                Download WP File
              </Button>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default DashboardIncidentesE;