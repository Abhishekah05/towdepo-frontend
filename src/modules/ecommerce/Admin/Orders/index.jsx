import React, { useEffect, useState } from 'react';
import AppsContainer from '@crema/components/AppsContainer';
import { useIntl } from 'react-intl';
import { Hidden, Box, Typography, Button, Dialog, DialogActions,IconButton , DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';

import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import AppsPagination from '@crema/components/AppsPagination';
import { Fonts } from '@crema/constants/AppEnums';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppSearchBar from '../../../../@crema/components/AppSearchBar';
import OrderTable from './OrderTable';
import AppLoader from '@crema/components/AppLoader';


import { useGetOrdersQuery, useDeleteOrderMutation } from '@crema/Slices/orderSlice';


const Orders = () => {
  const { messages } = useIntl();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const itemsPerPage = 10;

  const { data, error, isLoading, refetch } = useGetOrdersQuery({
    page,
    limit: itemsPerPage,
    search: searchQuery,
  });

  const [deleteOrder] = useDeleteOrderMutation();

  const onPageChange = (event, value) => {
    setPage(value);
  };

  const onSearchOrder = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to the first page when a new search is made
  };

  useEffect(() => { refetch() }, []

  );
  useEffect(() => {
    if (data) {
      // Filter orders based on the search query
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = data.orders.filter((order) => {
        return (
          String(order.orderNumber).toLowerCase().includes(lowerQuery) ||
          String(order.orderStatus).toLowerCase().includes(lowerQuery) ||
          order.items.some(item => item.title.toLowerCase().includes(lowerQuery)) ||
          String(order.userId.name).toLowerCase().includes(lowerQuery)
        );
      });
      setFilteredOrders(filtered);
    }
  }, [searchQuery, data]);

  const handleClickOpen = (orderId) => {
    setSelectedOrderId(orderId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrderId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteOrder(selectedOrderId).unwrap();
      refetch(); // Re-fetch orders after deletion
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to delete the order:', error);
    } finally {
      handleClose();
    }
  };
  if (isLoading) return <AppLoader/>
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <AppsContainer fullView  >
     
      <Box sx={{ mb: 2 }}>
        <Typography sx={{
          fontSize: 18,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
        }}>
          {messages['eCommerce.recentOrderss']}
        </Typography>
      </Box>
      <AppsHeader>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          width={1}
          justifyContent='space-between'

        >
          <AppSearchBar
            iconPosition='right'
            overlap={false}
            onChange={(event) => onSearchOrder(event.target.value)}
            placeholder={messages['common.searchHere']}
          />
          <Box display='flex' flexDirection='row' alignItems='center'>
            <Hidden smDown>
              <AppsPagination
                rowsPerPage={10}
                count={data?.totalResults}
                page={page}
                onPageChange={onPageChange}
                sx={{
                  ".MuiTablePagination-toolbar": {
                    display: "flex",
                    justifyContent: "end",
                    padding: "0.5rem",
                  },
                  ".MuiTablePagination-spacer": {
                    flex: "none",
                  },
                  ".MuiTablePagination-selectLabel": {
                    pt: 8,
                    fontSize: "12px",
                    color: "#535c69",
                  },
                  ".MuiTablePagination-displayedRows": {
                    pt: 8,
                    fontSize: "12px",
                    color: "#535c69",
                  },
                  ".MuiTablePagination-actions": {
                    alignItems: "center",
                  },
                }}
              />
            </Hidden>
          </Box>
        </Box>
      </AppsHeader>

      <AppsContent
        sx={{
          paddingTop: 2.5,
          paddingBottom: 2.5,
        }}
      >
        <OrderTable
          orderData={filteredOrders}
          onDeleteOrder={handleClickOpen}
          loading={isLoading}
        />
      </AppsContent>

      <Hidden smUp>
        <AppsPagination
          rowsPerPage={10}
          count={data?.totalResults}
          page={page}
          onPageChange={onPageChange}
        />
      </Hidden>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle sx={{ fontSize: "17px" }}>
          {"Confirm"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              "Confirm Order Item Delete"
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant='outlined'>
            {messages['common.cancel']}
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" variant='contained'>
            {messages['common.delete']}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'Center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success"    sx={{
            // width: "100%",
            backgroundColor: "#43a047", // Custom background color
            color: "white",
            fontWeight: "bold",
            "& .MuiSvgIcon-root": { color: "white" },
            padding: "2px 10px", 
            minHeight: "28px", 
            display: "flex",
            alignItems: "center", 
            justifyContent: "center", 
        }}>
          Order Deleted Successfully
        </Alert>
      </Snackbar>
    </AppsContainer>
  );
};

export default Orders;
