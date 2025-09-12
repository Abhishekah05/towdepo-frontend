import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import OrderActions from './OrderActions';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const TableItem = ({ data, onDeleteOrder, onCancelOrder }) => {
  console.log(data);

  const navigate = useNavigate();

  const getPaymentStatusColor = () => {
    switch (data.orderStatus) { // Use data.orderStatus here
      case 'Processing':
        return '#007BFF'; // Blue for processing
      case 'Delivered':
        return '#28A745'; // Green for delivered
      case 'Cancelled':
        return '#DC3545';
      case 'Shipped':
        return '#28A745'; // Green for shipped
      default:
        return '#FFA500'; // Default color for Pending
    }
  };


  const handleOrderClick = () => {
    navigate(`/ecommerce/order_detail/${id}`); // Use the correct path with dynamic ID
  };
   const formattedOrderDate = data.orderDate
      ? format(new Date(data.orderDate), 'MMMM/dd/yyyy hh:mm a')
      : 'N/A';

  return (
    <TableRow key={data.id} className='item-hover'>
      <StyledTableCell component='th' scope='row'>
        <Box
          sx={{
            color: 'primary.main',
            borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
            display: 'inline-block',
            cursor: 'pointer',
          }}

        >
          {data?.orderNumber}
        </Box>
      </StyledTableCell>
      <StyledTableCell align='left'>{data?.items[0]?.title}</StyledTableCell>
      <StyledTableCell align='left'>{data?.userId?.name}</StyledTableCell>
      <StyledTableCell align='left'>{formattedOrderDate}</StyledTableCell>
      <TableCell align='left'>
        {data?.items?.reduce((total, item) => total + (item?.quantity || 0), 0)}
      </TableCell>
      <StyledTableCell align='left'>{data?.totalAmount}</StyledTableCell>
      <StyledTableCell align='left'>{data?.paymentType || "Cash On Delivery"}</StyledTableCell>
      <StyledTableCell align='left'>
        <Box
          sx={{
            color: getPaymentStatusColor(),
            backgroundColor: getPaymentStatusColor() + '44',
            padding: '3px 5px',
            borderRadius: 1,
            fontSize: 14,
            display: 'inline-block',
          }}
        >
          {data?.orderStatus}
        </Box>
      </StyledTableCell>
      <StyledTableCell align='right'>
        <OrderActions 
          id={data.id} 
          onDeleteOrder={onDeleteOrder} 
          onCancelOrder={onCancelOrder}
          orderStatus={data.orderStatus}
        />
      </StyledTableCell>
    </TableRow>
  );
};

export default TableItem;

TableItem.propTypes = {
  data: PropTypes.object.isRequired,
  onDeleteOrder: PropTypes.func.isRequired,
  onCancelOrder: PropTypes.func.isRequired,
};