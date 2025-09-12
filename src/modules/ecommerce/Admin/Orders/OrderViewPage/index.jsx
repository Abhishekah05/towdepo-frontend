import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery, useGetOrderStatusQuery, useUpdateOrderMutation } from '@crema/Slices/orderSlice';
import { mediaUrl } from "@crema/constants/AppConst";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Avatar,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";


const StyledStatus = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.warning.dark,
  padding: '4px 8px',
  borderRadius: 16,
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '0.875rem'
}));

const OrderDetails = ({ order, orderStatusEnum }) => {

  const navigate = useNavigate();
  // Default values for undefined properties
  const {
    id = order.id,
    orderNumber = '',
    orderDate = new Date(),
    trackingId = '',
    customerName = '',
    customerSince = new Date(),
    shippingAddress = {},
    paymentMethod = '',
    orderType = '',
    items = [],
    totalAmount = 0,
    //status = 'Pending'||'',
    addresses = {},
  } = order || {};

  // Safely extract user details
  const userId = order.userId || {};
  const userProfileId = userId.userProfileId || {};
  const personalInfo = userProfileId.Personal_Information || {};

  const firstName = personalInfo.firstName || 'Unknown';
  const lastName = personalInfo.lastName || '';
  const email = userId.email || 'Not provided';
  const phoneNumber = personalInfo.phoneNumber || 'Not available';
  const status = order.orderStatus;

  const [statusArray, setStatusArray] = useState([]);
  const [statusSelection, setStatusSelection] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state

  const handleChange = (event) => {
    setStatusSelection(event.target.value);
  };

  const [updateOrder, { isLoading, isError, data }] = useUpdateOrderMutation();

  const handleSave = async () => {
    try {
      const response = await updateOrder({ id, orderStatus: statusSelection }).unwrap();

      console.log("Order status saved:", response);
      setSnackbarOpen(true); // Show Snackbar on success
      navigate(`/ecommerce/order-management`);
    } catch (error) {
      console.error("Error updating order status:", error);
      // Optionally, show an error message
    }
    
  };

  const handleNeedHelp = () => {
    navigate("/help"); // Navigate to Help page
  };

  console.log("Order status saved:", orderStatusEnum);
  useEffect(() => {
    if (orderStatusEnum) {
      setStatusArray(orderStatusEnum);
    }
  }, [orderStatusEnum]);
  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 7 }}>
          <Typography variant="body1" sx={{ fontSize: '16px' }}>
            Order Number: {orderNumber}
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '16px' }}>
            Order Date: {new Date(orderDate).toLocaleString()}
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '16px' }}>
            Tracking ID: {trackingId}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
        <Button
            variant="contained"
            color="primary"
            onClick={handleNeedHelp}
            sx={{
              height: 35,
              fontSize: "0.875rem"
            }}
          >
            Need Help
          </Button>
          <FormControl sx={{ minWidth: 120, height: 32 }}> {/* Decreased height */}
            <Select
              value={statusSelection || status}
              onChange={handleChange}
              variant="outlined"
              sx={{ height: 35, fontSize: "0.875rem" }} // Adjust font size for better fit
            >
              {statusArray?.map((status) => (
                <MenuItem value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            sx={{
              bgcolor: "black",
              "&:hover": { bgcolor: "#333" },
              minWidth: 120, /* Increased width */
              px: 4, /* Increased padding */
              height: 35, /* Decreased height */
              fontSize: "0.875rem" /* Adjust font size */
            }}
            onClick={handleSave}
          >
            Save
          </Button>

        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000} // Auto close after 3 seconds
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="success"
            onClose={() => setSnackbarOpen(false)}
            sx={{ width: '100%' }} // Ensures full width for better UI
          >
            Order Status Updated Successfully!
          </Alert>
        </Snackbar>


      </Box>

      <br />
      <br />

      {/* Customer Info, Address, Payment Info Cards */}
      <Grid container spacing={3} sx={{ mb: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', display: 'flex', alignItems: 'stretch' }}>
        {/* Customer Info Card */}
        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <Paper
            sx={{
              p: 6,
              borderRadius: '12px',
              flex: 1,

              boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.1)', // Light background
            }}
          >
            {/* Top Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Avatar & Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#f4511e', width: 45, height: 45 }}>
                  {firstName?.[0] || '?'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                    {`${firstName} ${lastName}`}
                  </Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                    Customer since <span style={{ fontWeight: 600, color: '#444' }}>
                      {new Date(customerSince).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </Typography>
                </Box>
              </Box>

              {/* Status Chip */}
              <Chip
                label={status}
                sx={{
                  bgcolor: '#fff3e0',
                  color: '#f4511e',
                  height: '24px',
                  fontSize: '0.75rem',
                  borderRadius: '8px',
                }}
              />
            </Box>
            {/* Contact Info Section */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: 3, marginTop: "40px", padding: "15px" }}>
              <Box>
                <Typography sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 500 }}>
                  Phone
                </Typography>
                <Typography sx={{ color: 'black', fontSize: '0.9rem', fontWeight: 500 }}>
                  {phoneNumber}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 500 }}>
                  Email
                </Typography>
                <Typography sx={{ color: 'black', fontSize: '0.9rem', fontWeight: 500 }}>
                  {email}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Address Info Card */}
        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <Paper sx={{ p: 6, ml: 4, mr: 4, borderRadius: '12px', flex: 1, boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.1)' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOnOutlinedIcon sx={{ color: '#f4511e' }} />
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                Address Details
              </Typography>
            </Box>

            {/* Shipping Address Section */}
            <Box>
              <Typography sx={{ color: '#555', fontSize: '0.9rem', fontWeight: 500, mb: 1 }}>
                Shipping Address
              </Typography>
              <Typography sx={{ color: 'black', fontSize: '0.9rem', mb: 3 }}>
                {shippingAddress?.addressLine1 || 'Not Available'},
                {shippingAddress?.city || 'Not Available'},
                {shippingAddress?.state || 'Not Available'} -
                {shippingAddress?.postalCode || 'Not Available'},
                {shippingAddress?.country || 'Not Available'}
              </Typography>

              {/* Phone Number */}
              <Typography sx={{ color: '#555', fontSize: '0.9rem', fontWeight: 500, mt: 12 }}>
                Contact
              </Typography>
              <Typography sx={{ color: 'black', fontSize: '0.9rem', }}>
                {shippingAddress?.phoneNumber || 'Not Available'}
              </Typography>
            </Box>
          </Paper>
        </Grid>


        {/* Payment Info Card */}
        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <Paper sx={{ p: 6, borderRadius: '12px', flex: 1, boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CreditCardOutlinedIcon sx={{ color: '#f4511e' }} />
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                Payment Details
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ color: '#555', fontSize: '0.9rem', fontWeight: 500, mb: 1 }}>
                Payment Method
              </Typography>
              <Typography sx={{ color: 'black', fontSize: '0.9rem', mb: 3 }}>
                {paymentMethod || 'Cash on Delivery(COD)'}
              </Typography>
              <Typography sx={{ color: '#555', fontSize: '0.9rem', fontWeight: 500, mt: 11 }}>
                Order Type
              </Typography>
              <Typography sx={{ color: 'black', fontSize: '0.9rem' }}>
                {orderType || 'Standard Order'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <br />
      <br />
      {/* Orders Table */}
      <Paper elevation={1}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontSize: '17px', paddingLeft: '10px' }}>
            Items : <span style={{ color: '#f4511e' }}>{items.length}</span>
          </Typography>

          {/* <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search"
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" />
              }}
            />
            <Button variant="outlined" size="small">
              Sort
            </Button>
            <Select
              size="small"
              value=""
              displayEmpty
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">Bulk Action</MenuItem>
            </Select>
          </Box> */}
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell> */}
                <TableCell sx={{ fontSize: '18px' }}>Product Name</TableCell>
                <TableCell sx={{ fontSize: '18px' }}>Unit Price</TableCell>
                <TableCell sx={{ fontSize: '18px' }}>Qty</TableCell>
                <TableCell sx={{ fontSize: '18px' }}>Discount</TableCell>
                <TableCell sx={{ fontSize: '18px' }}>Order Total</TableCell>
                {/* <TableCell sx={{ fontSize: '18px' }}>Status</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => {
                console.log("item", item);
                const {
                  title = '',
                  image = `${mediaUrl}/product/${item?.productVariantId?.images[0]}` || "not found",
                  unitPrice = 0,
                  quantity = 0,
                  discount = 0,
                  totalPrice = 0,
                  status = 'Pending'
                } = item || {};

                return (
                  <TableRow key={index}>
                    {/* <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell> */}
                    <TableCell >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: "18px" }}>
                        <Box
                          component="img"
                          src={image}
                          sx={{ width: 40, height: 40, borderRadius: 1 }}
                        />
                        <Typography>{title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '18px' }}>${(unitPrice || 0).toLocaleString()}</TableCell>
                    <TableCell sx={{ fontSize: '18px' }}>{quantity}</TableCell>
                    <TableCell sx={{ fontSize: '18px' }}>${(discount || 0).toLocaleString()}</TableCell>
                    <TableCell sx={{ fontSize: '18px' }}>${(totalPrice || 0).toLocaleString()}</TableCell>
                    {/* <TableCell>
                      <Select
                        size="small"
                        value={status}
                        onChange={(e) => handleStatusChange(e, index)} // handle status change
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Under Process">Under Process</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Completed">Cancel</MenuItem>
                      </Select>
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>


        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', }}>
          <Typography sx={{ fontSize: '18px', marginRight: "100px", padding: "10px" }}>
            Total: ${(totalAmount || 0).toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

const OrderView = () => {
  const { id } = useParams();
  const { data: orderData, isLoading, isError } = useGetOrderByIdQuery(id);
  const { data: orderStatusEnum, error, } = useGetOrderStatusQuery();
  console.log("Order status saved:", orderStatusEnum);
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={3}>
        <ErrorOutlineIcon sx={{ fontSize: 50, color: 'error.main', mb: 1 }} />
      </Box>
    );
  }

  if (!orderData) {
    return (
      <Box p={3}>
        <Typography variant="h6">Order not found.</Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <OrderDetails order={orderData} orderStatusEnum={orderStatusEnum} />
      </CardContent>
    </Card>
  );
};

export default OrderView;
