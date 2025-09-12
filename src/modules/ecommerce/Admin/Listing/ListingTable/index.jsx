import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import PropTypes from 'prop-types';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import AppTableContainer from '@crema/components/AppTableContainer';
import AppLoader from '@crema/components/AppLoader';

const ProductTable = ({ productData, loading, handleDeleteClick }) => {
  return (
    <AppTableContainer>
      {loading ? (
        <AppLoader />
      ) : (
        <Table stickyHeader className='table'>
          <TableHead>
            <TableHeading />
          </TableHead>
          <TableBody>
            {productData && productData.length > 0 ? (
              productData.map((data) => (
                <TableItem data={data} key={data.id} handleDeleteClick={handleDeleteClick} />
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                  No products found
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      )}
    </AppTableContainer>
  );
};

export default ProductTable;

ProductTable.defaultProps = {
  productData: [],
};

ProductTable.propTypes = {
  productData: PropTypes.array,
  loading: PropTypes.bool,
  handleDeleteClick: PropTypes.func,
};