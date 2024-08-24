import React, { useState } from 'react';
import { Box, Typography, IconButton, InputBase, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stepper, Step, StepLabel, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import Sidebar from "../public/src/components/Sidebar";
import Map from "../public/src/components/Map";
import styles from "../public/src/components/Dashboard.module.css";

const Input = styled('input')({
  display: 'none',
});

const DashboardReportesE = () => {
  const [files, setFiles] = useState([]);
  const [scriptOutput, setScriptOutput] = useState('');
  const [runId, setRunId] = useState('');
  const [filePath, setFilePath] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Upload Files', 'Run Python Script', 'Refresh Map'];

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setActiveStep(1);
  };

  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const runPythonScript = async () => {
    setIsLoading(true);
    setError('');
    setScriptOutput('');
    setRunId('');
    setFilePath('');

    try {
      const response = await fetch('http://localhost:5000/run-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        setError(`Server Error: ${data.error}`);
      } else {
        setScriptOutput(data.result);
        setRunId(data.runId);
        setFilePath(data.filePath);
        setActiveStep(2);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMap = () => {
    // Implement map refresh logic here
    console.log('Refreshing map...');
    setActiveStep(0);  // Reset to the first step after completing the process
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent} p={3}>
          {/* Header and search bar code remains the same */}
          
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
              sx={{ ml: 2, background: "#FB8C00" }}
              onClick={runPythonScript}
              startIcon={isLoading ? <CircularProgress size={24} /> : <RunCircleIcon />}
              disabled={activeStep !== 1 || isLoading}
            >
              {isLoading ? 'Running...' : 'Run Python Script'}
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={refreshMap}
              startIcon={<RefreshIcon />}
              disabled={activeStep !== 2}
            >
              Refresh Map
            </Button>
          </Box>

          {error && (
            <Paper sx={{ mt: 2, p: 2, bgcolor: '#ffebee' }}>
              <Typography color="error">
                {error}
              </Typography>
            </Paper>
          )}

          {scriptOutput && (
            <Paper sx={{ mt: 2, p: 2, maxHeight: 200, overflowY: 'auto' }}>
              <Typography variant="h6">Script Output:</Typography>
              <pre>{scriptOutput}</pre>
              {runId && (
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Run ID: {runId}
                </Typography>
              )}
              {filePath && (
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Created File: {filePath}
                </Typography>
              )}
            </Paper>
          )}

          <TableContainer component={Paper} sx={{ mt: 2 }}>
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

          <Map />
        </Box>
      </div>
    </div>
  );
};

export default DashboardReportesE;