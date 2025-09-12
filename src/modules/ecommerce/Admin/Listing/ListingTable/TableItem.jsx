import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import OrderActions from './OrderActions';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ellipsisLines } from '@crema/helpers/StringHelper';
import { mediaUrl } from "@crema/constants/AppConst.jsx";


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
  const date = new Date(dateString);

  // Manually format the date to include AM/PM
  const options = {
    year: 'numeric',
    month: 'short', // 'Jan', 'Feb', etc.
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // To show AM/PM
  };

  // Format the date using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  // Split formatted date into parts to rearrange it as needed
  const [month, day, year, time, period] = formattedDate.split(' ');

  // Return in custom format: 'Month/Day/Year HH:MM AM/PM'
  return `${month}/${day.replace(',', '')}/${year} ${time} ${period}`;
};



const TableItem = ({ data, handleDeleteClick }) => {
  const navigate = useNavigate();
  const getPaymentStatusColor = () => {
    switch (data.inStock) {
      case true: {
        return '#43C888';
      }
      case false: {
        return '#F84E4E';
      }
    }
  };

  return (
    <TableRow key={data.name} className='item-hover'>
      <StyledTableCell align='start' sx={{ width: 400 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'primary.main',
          }}
          onClick={() => navigate(`/ecommerce/product-settings/${data?.id}`)}
        >
          <img
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',
              marginRight: 10,
            }}
            src={data?.images?.length > 0 ? `${mediaUrl}/product/${data.images[0].src}` : '/default-image.jpg'}
            alt='Product Image'
          />

          {ellipsisLines(data.title)}
        </Box>
      </StyledTableCell>
      <StyledTableCell align='start'>{data.SKU}</StyledTableCell>
      <StyledTableCell align='start'> {formatDate(data.created_on)}</StyledTableCell>
      <StyledTableCell align='start'>
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
          {data.inStock ? 'In Stock' : 'Out of Stock'}
        </Box>
      </StyledTableCell>
      <StyledTableCell align='start'>${data.mrp}</StyledTableCell>
      <TableCell align='start'>
        <OrderActions id={data.id} data={data} handleDeleteClick={handleDeleteClick} />
      </TableCell>
    </TableRow>
  );
};

export default TableItem;

TableItem.propTypes = {
  data: PropTypes.object.isRequired,
};
