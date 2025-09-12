import React from 'react';
import { useMediaQuery, useTheme ,Box  } from '@mui/material';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import MobileTableItem from './MobileItemTable'; // We'll create this new component
import AppTableContainer from '@crema/components/AppTableContainer';
import PropTypes from 'prop-types';

const CartTable = ({ cartItems, onRemoveItem, onIncrement, onDecrement }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppTableContainer>
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cartItems.map((data) => (
            <MobileTableItem
              key={data.id}
              data={data}
              onRemoveItem={onRemoveItem}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
            />
          ))}
        </Box>
      ) : (
        <Table stickyHeader className='table'>
          <TableHead>
            <TableHeading />
          </TableHead>
          <TableBody>
            {cartItems.map((data) => (
              <TableItem
                key={data.id}
                data={data}
                onRemoveItem={onRemoveItem}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </AppTableContainer>
  );
};

export default CartTable;

CartTable.propTypes = {
  cartItems: PropTypes.array,
  onDecrement: PropTypes.func,
  onIncrement: PropTypes.func,
  onRemoveItem: PropTypes.func,
};