// components/DataTable.js
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const DataTable = ({ data, onSelectRoute, onDownloadRoute }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Route Number</TableCell>
            <TableCell>Priority Score</TableCell>
            <TableCell>Mode</TableCell>
            <TableCell>Flight Time</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.priority_score}</TableCell>
              <TableCell>{row.mode}</TableCell>
              <TableCell>{row.flight_time}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onSelectRoute(row)}
                >
                  View on Map
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => onDownloadRoute(row)}
                >
                  Download WP File
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
