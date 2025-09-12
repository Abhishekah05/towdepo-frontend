import React from 'react';
import { Link } from 'react-router-dom';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import OrderActions from './OrderActions';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';

const StyledTableCell = styled(TableCell)(() => ({
  fontSize: 14,
  padding: 8,
  '&:first-of-type': {
    paddingLeft: 20,
  },
  '&:last-of-type': {
    paddingRight: 20,
  },
}));

const TableItem = ({ data, onDeleteOrder }) => {
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return '#007BFF'; // Blue for processing
      case 'Delivered':
        return '#28A745'; // Green for delivered
      case 'Cancelled':
        return '#DC3545';
      case 'Shipped':
        return '#28A745'; // Red for cancelled
      default:
        return '#FFA500'; // Orange for pending (default)
    }
  };

  // Format orderDate to "MonthName/Date/Year HH:mm AM/PM"
  const formattedOrderDate = data.orderDate
    ? format(new Date(data.orderDate), 'MMMM/dd/yyyy hh:mm a')
    : 'N/A';

  return (
    <TableRow key={data.name} className='item-hover' sx={{ overflow: 'hidden' }}>
      <StyledTableCell component='th' scope='row'>
        <Box
          sx={{
            color: 'primary.main',
            borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
            display: 'inline-block',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
          component={Link}
          to={`/ecommerce/order_detail/${data.id}`}
        >
          {data.orderNumber}
        </Box>
      </StyledTableCell>
      <StyledTableCell align='left'>{data?.items[0]?.title}</StyledTableCell>
      <StyledTableCell align='left'>
        {data?.items?.reduce((total, item) => total + item.quantity, 0)}
      </StyledTableCell>
      <StyledTableCell align='left'>{data.userId.name}</StyledTableCell>
      <StyledTableCell align='left'>{formattedOrderDate}</StyledTableCell>
      <StyledTableCell align='left'>{data.totalAmount}</StyledTableCell>
      <StyledTableCell align='left'>{data.paymentType}</StyledTableCell>
      <StyledTableCell align="left">
        <Box
          sx={{
            color: getPaymentStatusColor(data.orderStatus),
            backgroundColor: getPaymentStatusColor(data.orderStatus) + '44', // 44 adds transparency
            padding: '3px 5px',
            borderRadius: 1,
            fontSize: 14,
            display: 'inline-block',
          }}
        >
          {data.orderStatus}
        </Box>
      </StyledTableCell>
      <TableCell align='right'>
        <OrderActions id={data.id} onDeleteOrder={onDeleteOrder} />
      </TableCell>
    </TableRow>
  );
};

export default TableItem;

TableItem.propTypes = {
  data: PropTypes.object.isRequired,
  onDeleteOrder: PropTypes.func.isRequired,
};
