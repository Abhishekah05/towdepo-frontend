import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Fonts } from '@crema/constants/AppEnums';
import { styled } from '@mui/material/styles';
import { mediaUrl } from "@crema/constants/AppConst.jsx";

// Styled TableCell component
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

const TableItem = ({ data, onRemoveItem, onIncrement, onDecrement }) => {

  const productImageUrl =
    data.images[0] ||
    (data.variant && data.variant[0]?.image) ||
    (data.image && data.image[0]?.src) ||
    'default-image.jpg';
  const price = Number(data?.price) || 0;
  const totalPrice = Number(data?.totalPrice) || price * (data?.quantity || 1);

  // Ensure quantity is not less than 1
  const handleDecrement = () => {
    if (data.quantity > 1) {
      onDecrement(data);
    }
  };

  return (
    <TableRow key={data.id} className="item-hover">
      <StyledTableCell>
        <Box display="flex">
          <Avatar
            sx={{ mr: 3.5 }}
            src={`${mediaUrl}/product/${productImageUrl}`}
            alt={data.title || "Product Image"}
          />
          <Box>
            <Box fontSize={14} fontWeight={Fonts.MEDIUM}>
              {data.sku} - {data.title}
            </Box>
          </Box>
        </Box>
      </StyledTableCell>

      <StyledTableCell align="left" fontWeight={Fonts.MEDIUM}>
        ${price.toFixed(2)}
      </StyledTableCell>

      <StyledTableCell align="left">
        <Box
          border={1}
          borderRadius={4}
          display="flex"
          borderColor="text.secondary"
          alignItems="center"
          justifyContent="center"
          width={100}
          height={36}
        >
          <AddIcon
            className="pointer"
            onClick={() => onIncrement(data)}
            aria-label="Increase quantity"
            title="Increase quantity"
          />
          <Box component="span" px={3}>
            {data.quantity || 1}
          </Box>
          <RemoveIcon
            className="pointer"
            onClick={handleDecrement}
            aria-label="Decrease quantity"
            title="Decrease quantity"
          />
        </Box>
      </StyledTableCell>

      <StyledTableCell align="left" fontWeight={Fonts.MEDIUM}>
        ${totalPrice.toFixed(2)}
      </StyledTableCell>

      <StyledTableCell component="th" scope="row">
        <CancelIcon
          onClick={() => onRemoveItem(data)}
          aria-label="Remove item"
          title="Remove item"
        />
      </StyledTableCell>
    </TableRow>
  );
};

TableItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    sku: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    totalPrice: PropTypes.number,
    quantity: PropTypes.number,
    images: PropTypes.array,
    image: PropTypes.string,
  }).isRequired,
  onDecrement: PropTypes.func.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

export default TableItem;
