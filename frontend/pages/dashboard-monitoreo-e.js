import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
  Slider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Sidebar from "../public/src/components/Sidebar";
import styles from "../public/src/components/Dashboard.module.css";
import WaypointMapWrapper from '../public/src/components/WaypointMapWrapper';
import DataTable from '../public/src/components/DataTable';

const DashboardMonitoreo = () => {
  const [routesData, setRoutesData] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Drone configuration states
  const [altitude, setAltitude] = useState(50); // Overlap
  const [speed, setSpeed] = useState(10); // Speed
  const [mode, setMode] = useState(false); // Mode (true = High, false = Low)
  const [visionRange, setVisionRange] = useState(100); // Vision Range
  const [flightTime, setFlightTime] = useState(30); // Flight Time

  // Fetch routes data from backend
  useEffect(() => {
    const fetchRoutesData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/missions");
        setRoutesData(response.data);
      } catch (error) {
        console.error("Error fetching routes data:", error);
      }
    };
    
    fetchRoutesData();
  }, []);

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  const handleGenerateRoute = async () => {
    try {
      const response = await axios.post("http://localhost:5000/generate_route", {
        altitude,
        speed,
        mode,
        visionRange,
        flightTime,
      });
      if (response.data.success) {
        // Handle successful route generation, e.g., update routes data
        alert("Route generated successfully!");
        // Optionally, you can fetch updated routes data here
      } else {
        console.error("Error generating route:", response.data.message);
      }
    } catch (error) {
      console.error("Error generating route:", error);
    }
  };
  const handleDownloadRoute = async (route) => {
    try {
      const response = await axios.get(`http://localhost:5000/download_wp/${route.id}`, {
        responseType: 'blob', // Important for file downloads
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `route_${route.id}.wp`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading WP file:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
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
            Monitoreo
          </Typography>
          <DataTable data={routesData} onSelectRoute={handleRouteSelect} />
          <WaypointMapWrapper selectedRoute={selectedRoute} />

          {/* Drone Configuration Panel */}
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
              label={mode ? "High Altitude" : "Low Altitude"}
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateRoute}
            >
              Generate Route
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default DashboardMonitoreo;


