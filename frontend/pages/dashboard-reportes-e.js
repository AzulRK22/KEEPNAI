import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import Sidebar from '../public/src/components/Sidebar';
import styles from '../public/src/components/Dashboard.module.css';
import ChatGPT from '../public/src/components/chatgpt'; // Ensure the casing matches the file

const DashboardReportesE = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent}>
          <div className={styles.header}>
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
           
          </Typography>
          <ChatGPT />
        </Box>
      </div>
    </div>
  );
};

export default DashboardReportesE;
