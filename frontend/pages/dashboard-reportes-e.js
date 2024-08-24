import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { Box, Typography, IconButton, InputBase, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stepper, Step, StepLabel } from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import Sidebar from "../public/src/components/Sidebar";
import MapComponent from "../public/src/components/MapComponent";
import styles from "../public/src/components/Dashboard.module.css";

const Input = styled('input')({
  display: 'none',
});

const DashboardReportesE = () => {
  const [files, setFiles] = useState([]);
  const [scriptOutput, setScriptOutput] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [csvData, setCsvData] = useState([]);

  const steps = ['Upload Files', 'Run Python Script', 'Refresh Map'];

  useEffect(() => {
    // Cargar el archivo CSV al montar el componente
    axios.get('http://127.0.0.1:5000/results/results_log.csv', { responseType: 'text' })
      .then(response => {
        Papa.parse(response.data, {
          header: true,
          complete: (results) => {
            setCsvData(results.data);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching CSV:', error);
      });
  }, []);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setActiveStep(1);
  };

  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const runPythonScript = async () => {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('file', file));

      const uploadResponse = await axios.post('/api/upload-files', formData);
      if (uploadResponse.status !== 200) {
        throw new Error('Error uploading files');
      }

      const scriptResponse = await axios.post('/api/run-python-script');
      setScriptOutput(scriptResponse.data.result);
    } catch (error) {
      setScriptOutput(`Error: ${error.message}`);
    }
    setActiveStep(2);
  };

  const refreshMap = () => {
    // Reset map logic if necessary
    console.log('Refreshing map...');
    setActiveStep(0);  // Reset to the first step after completing the process
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
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mb: 2 }}>
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
                disabled={activeStep !== 0}
              >
                Upload Files
              </Button>
            </label>

            <Button
              variant="contained"
              color="secondary"
              sx={{ marginLeft: 2, background: "#FB8C00" }}
              onClick={runPythonScript}
              startIcon={<RunCircleIcon />}
              disabled={activeStep !== 1}
            >
              Run Python Script
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ marginLeft: 2 }}
              onClick={refreshMap}
              startIcon={<RefreshIcon />}
              disabled={activeStep !== 2}
            >
              Refresh Map
            </Button>
          </Box>

          {scriptOutput && (
            <Box sx={{ marginTop: 2, marginBottom: 2 }}>
              <Typography variant="body1">Script Output:</Typography>
              <Typography variant="body2">{scriptOutput}</Typography>
            </Box>
          )}

          <TableContainer component={Paper}>
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

          <Typography variant="h6" gutterBottom mt={4}>
            CSV Data
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {csvData[0] && Object.keys(csvData[0]).map((key) => (
                    <TableCell key={key}>{key}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {csvData.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value, idx) => (
                      <TableCell key={idx}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <MapComponent />
        </Box>
      </div>
    </div>
  );
};

export default DashboardReportesE;
