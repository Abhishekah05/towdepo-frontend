//   import Basic from './Basic';
//   import BasicSource from './Basic?raw';
//   import CustomPicker from './CustomPicker';
//   import CustomPickerSource from './CustomPicker?raw';
//   // import WithRedux from './WithRedux';
//   // import WithReduxSource from './WithRedux?raw';
//   import AppComponentCard from '@crema/components/AppComponentCard';
//   import AppComponentHeader from '@crema/components/AppComponentHeader';
//   import AppGridContainer from '@crema/components/AppGridContainer';
//   import Grid from '@mui/material/Grid';

// src/RecordsTable.js
import React, { useEffect, useState } from 'react';
// import DriverChart from './chartcopy';
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


const ColorPickercopy = () => {
  const [records, setRecords] = useState([]);

//   useEffect(() => {
//     // Fetch records from the server
//     axios.get('http://localhost:4500/records')
//       .then(response => {
//         setRecords(response.data);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the records!', error);
//       });
//   }, []);

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
    </div>
  );
};

export default ColorPickercopy;


  
 
  