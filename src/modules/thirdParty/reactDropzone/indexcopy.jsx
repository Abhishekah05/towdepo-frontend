// src/RecordsTable.js
import React, { useEffect, useState } from 'react';
import DriverChart from './chartcopy';
import DriverChart1 from './chartcopy1';
import DriverChart2 from './chartcopy2';
import DriverChart3 from './chartcopy3';
import DriverChart4 from './chartcopy4';
import DriverChart5 from './chartcopy5';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';


const ReactDropzonecopy = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Fetch records from the server
    axios.get('http://localhost:4500/records')
      .then(response => {
        setRecords(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the records!', error);
      });
  }, []);

  return (
    <div>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Purchase Order</TableCell>
            <TableCell>Call Number</TableCell>
            <TableCell>Invoice Number</TableCell>
            <TableCell>Account Name</TableCell>
            <TableCell>VIN</TableCell>
            <TableCell>Received</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Balance Due</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record._id}>
              <TableCell>{record.purchaseOrder}</TableCell>
              <TableCell>{record.callNumber}</TableCell>
              <TableCell>{record.invoiceNumber}</TableCell>
              <TableCell>{record.accountName}</TableCell>
              <TableCell>{record.vin}</TableCell>
              <TableCell>{record.driver}</TableCell>
              <TableCell>{record.status}</TableCell>
              <TableCell>{record.balanceDue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <DriverChart/>
    <DriverChart1/>
    <DriverChart2/>
    <DriverChart3/>
    <DriverChart4/>
    <DriverChart5/>

    </div>
  );
};

export default ReactDropzonecopy;

