import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/components/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell align='start'> Product Name</TableCell>
      <TableCell align='start'>Product SKU</TableCell>
      <TableCell align='start'>Created at</TableCell>
      <TableCell align='start'>Status</TableCell>
      <TableCell align='start'>Price</TableCell>
      <TableCell align='start'>Actions</TableCell>
    </TableHeader>
  );
};

export default TableHeading;
