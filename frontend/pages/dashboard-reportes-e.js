import React, { useState } from 'react';
import { Box, Typography, IconButton, InputBase, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import RunCircleIcon from '@mui/icons-material/RunCircle'; // Icono para ejecutar el script
import Sidebar from "../public/src/components/Sidebar";
import Map from "../public/src/components/Map";
import styles from "../public/src/components/Dashboard.module.css";

const Input = styled('input')({
  display: 'none',
});

const DashboardReportesE = () => {
  const [files, setFiles] = useState([]);
  const [scriptOutput, setScriptOutput] = useState('');

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const runPythonScript = async () => {
    try {
      const response = await fetch('/api/run-script', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        setScriptOutput(data.result);
      } else {
        setScriptOutput(`Error: ${data.error}`);
      }
    } catch (error) {
      setScriptOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent} p={3}>
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
            Resources
          </Typography>
          
          {/* Botón para cargar archivos */}
          <label htmlFor="file-upload">
            <Input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileSelect}
            />
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<FolderIcon />}
            >
              Upload Files
            </Button>
          </label>

          {/* Botón para ejecutar el script de Python */}
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginLeft: 2, background: "#FB8C00" }}
            onClick={runPythonScript}
            startIcon={<RunCircleIcon />}
          >
            Run Python Script
          </Button>

          {/* Mostrar salida del script */}
          {scriptOutput && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1">Script Output:</Typography>
              <Typography variant="body2">{scriptOutput}</Typography>
            </Box>
          )}

          {/* Tabla para mostrar archivos */}
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Mapa */}
          <Map />
        </Box>
      </div>
    </div>
  );
};

export default DashboardReportesE;


