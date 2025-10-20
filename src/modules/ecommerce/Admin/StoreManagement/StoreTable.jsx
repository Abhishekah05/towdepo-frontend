// components/Store/StoreList.js (Updated with View Products Button)
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Button,
  Box,
  TextField,
  InputAdornment,
  TablePagination,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  PersonOutline as PersonOutlineIcon,
  Visibility as ViewIcon,
  Inventory as ProductsIcon
} from '@mui/icons-material';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import { useAuthUser } from '../../../../@crema/hooks/AuthHooks';
import { useNavigate } from 'react-router-dom';

const StoreList = ({ onEdit, onAdd, onDelete, onViewProducts }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    storeId: null,
    storeName: ''
  });

  console.log("user", user);

  // Determine API endpoint based on user role
  const getApiEndpoint = () => {
    const isSuperAdmin = user?.role[0] === 'superadmin'; 
    if (isSuperAdmin) {
      return '/store'; 
    } else {
      return `/store/owner/${user.id}`; 
    }
  };

  // Listen for store update events to refresh the list
  useEffect(() => {
    const handleStoreUpdated = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    window.addEventListener('storeUpdated', handleStoreUpdated);
    return () => {
      window.removeEventListener('storeUpdated', handleStoreUpdated);
    };
  }, []);


  //snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };


  //getdataapi hook
  const [{ loading, apiData }, { setQueryParams, reCallAPI }] = useGetDataApi(
    getApiEndpoint(),
    { results: [], totalResults: 0 },
    {
      page: page + 1,
      limit: rowsPerPage,
      name: searchTerm || undefined 
    },
    true,
    null,
    refreshTrigger
  );

  //fetches the latest store list
  useEffect(() => {
    const handleStoreUpdated = () => {
      reCallAPI();
    };

    window.addEventListener('storeUpdated', handleStoreUpdated);
    return () => {
      window.removeEventListener('storeUpdated', handleStoreUpdated);
    };
  }, [reCallAPI]);



  //handlesearch
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setPage(0); 
    setQueryParams({
      page: 1, 
      limit: rowsPerPage,
      name: value || undefined
    });
  };

  
  //handlechange page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setQueryParams({
      page: newPage + 1,
      limit: rowsPerPage,
      name: searchTerm || undefined
    });
  };

  //handlerows per page
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); 
    setQueryParams({
      page: 1,
      limit: newRowsPerPage,
      name: searchTerm || undefined
    });
  };



  // Update the handleEdit function:
  const handleEdit = (store) => {
    const storeId = store.id || store._id;
    onEdit(store);
  };


  // Update the handleDelete function with dialog:
  const handleDeleteClick = (storeId, storeName) => {
    setDeleteDialog({
      open: true,
      storeId,
      storeName
    });
  };

  //handle confirm Delete
  const handleConfirmDelete = async () => {
    const { storeId } = deleteDialog;
    try {
      await onDelete(storeId);
    } catch (error) {
      console.error('Error deleting store:', error);
      showSnackbar(error.message || 'Error deleting store', 'error');
    } finally {
      setDeleteDialog({ open: false, storeId: null, storeName: '' });
    }
  };
  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, storeId: null, storeName: '' });
  };

  // Updated handleViewProducts function to navigate to ProductListing page
  // Get the owner ID - for superadmin viewing other stores, use store owner ID
const handleViewProducts = (store) => {
    let ownerIdToPass;

    if (user?.role[0] === 'superadmin' || user?.role[0] === 'admin') {
      if (store.owner && typeof store.owner === 'object') {
        ownerIdToPass = store.owner.id || store.owner._id;
      } else if (store.owner) {
        ownerIdToPass = store.owner;
      } else {
        showSnackbar('No owner assigned to this store', 'error');
        return;
      }
    } else {
      ownerIdToPass = user.id;
    }
    // Navigate to ProductListing page with owner ID
    navigate('/ecommerce/product-listing', {
      state: {
        ownerId: ownerIdToPass,
        storeName: store.name
      }
    });
  };


  // Get owner display information
  const getOwnerDisplay = (store) => {
    if (!store.owner) {
      return {
        display: 'No owner assigned',
        tooltip: 'This store has no owner assigned',
        icon: <PersonOutlineIcon fontSize="small" />,
        color: 'default',
        variant: 'outlined'
      };
    }

    // If owner is populated as an object
    if (typeof store.owner === 'object' && store.owner !== null) {
      return {
        display: store.owner.name,
        tooltip: `Owner: ${store.owner.name} (${store.owner.email}) - ${store.owner.phone}`,
        icon: <PersonIcon fontSize="small" />,
        color: 'primary',
        variant: 'filled',
        email: store.owner.email,
        phone: store.owner.phone,
        id: store.owner.id || store.owner._id
      };
    }

    // Fallback if owner is still an ID string
    return {
      display: 'Owner details loading...',
      tooltip: 'Fetching owner information...',
      icon: <PersonIcon fontSize="small" />,
      color: 'default',
      variant: 'outlined'
    };
  };

  // Get avatar initials for owner
  const getAvatarInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  

  // Get stores data based on API response structure
  const stores = apiData?.results || [];
  const totalStores = apiData?.totalResults || 0;

  // Mobile Card View
  const MobileStoreCard = ({ store }) => {
    const storeId = store.id || store._id;
    const ownerInfo = getOwnerDisplay(store);

    return (
      <Card sx={{ mb: 2, p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="div" gutterBottom>
              {store.name}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              <Chip
                label={store.isActive ? 'Active' : 'Inactive'}
                color={store.isActive ? 'success' : 'default'}
                size="small"
              />
              <Tooltip title={ownerInfo.tooltip}>
                <Chip
                  icon={ownerInfo.icon}
                  label={ownerInfo.display}
                  color={ownerInfo.color}
                  variant={ownerInfo.variant}
                  size="small"
                />
              </Tooltip>
            </Box>
          </Box>

          {store.description && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {store.description}
            </Typography>
          )}

          <Stack spacing={1} sx={{ mb: 2 }}>
            {/* Owner Information */}
            {store.owner && ownerInfo.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                  {getAvatarInitials(ownerInfo.display)}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {ownerInfo.display}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {ownerInfo.email}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {store.address?.street}, {store.address?.city}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {store.contact?.phone}
              </Typography>
            </Box>

            {store.contact?.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {store.contact.email}
                </Typography>
              </Box>
            )}

            <Typography variant="body2">
              Delivery Radius: {store.deliveryRadius} km
            </Typography>
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Tooltip title="Edit Store">
              <IconButton
                size="small"
                onClick={() => handleEdit(store)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="View Products">
              <IconButton
                size="small"
                onClick={() => handleViewProducts(store)}
                color="info"
              >
                <ProductsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Store">
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(storeId, store.name)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{
          p: isMobile ? 1 : 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <TextField
            placeholder="Search stores..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: isMobile ? '100%' : 300,
              maxWidth: isMobile ? '100%' : 300
            }}
            size={isMobile ? "small" : "medium"}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{
              width: isMobile ? '100%' : 'auto',
              minWidth: isMobile ? 'auto' : 140
            }}
            size={isMobile ? "small" : "medium"}
          >
            Add Store
          </Button>
        </Box>

        {isMobile ? (
          // Mobile Card View
          <Box sx={{ p: 1 }}>
            {loading ? (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                Loading...
              </Box>
            ) : stores.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                No stores found
              </Box>
            ) : (
              stores.map((store) => (
                <MobileStoreCard key={store.id || store._id} store={store} />
              ))
            )}
          </Box>
        ) : (
          // Desktop Table View
          <>
            <TableContainer>
              <Table>
                <TableHead sx={{
                  '& .MuiTableCell-head': {
                    fontWeight: 'bold',
                    fontSize: '1rem', // increase size here
                    color: '#333',
                  },
                }} >
                  <TableRow>
                    <TableCell>Store Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Delivery Radius</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : stores.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No stores found
                      </TableCell>
                    </TableRow>
                  ) : (
                    stores.map((store) => {
                      const storeId = store.id || store._id;
                      const ownerInfo = getOwnerDisplay(store);

                      return (
                        <TableRow key={storeId} hover>
                          <TableCell>
                            <Box>
                              <strong>{store.name}</strong>
                              {store.description && (
                                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 0.5 }}>
                                  {store.description}
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <div>{store.address?.street}</div>
                              <div>
                                {store.address?.city}, {store.address?.state} {store.address?.postalCode}
                              </div>
                              {store.location?.coordinates && store.location.coordinates.some(coord => coord !== 0) && (
                                <Chip
                                  icon={<LocationIcon />}
                                  label="Has Location"
                                  size="small"
                                  variant="outlined"
                                  sx={{ mt: 0.5 }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <div>{store.contact?.phone}</div>
                              {store.contact?.email && (
                                <div style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                  {store.contact.email}
                                </div>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {store.owner ? (
                              <Tooltip title={ownerInfo.tooltip}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                                    {getAvatarInitials(ownerInfo.display)}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" fontWeight="medium">
                                      {ownerInfo.display}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      {ownerInfo.email}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Tooltip>
                            ) : (
                              <Tooltip title={ownerInfo.tooltip}>
                                <Chip
                                  icon={ownerInfo.icon}
                                  label={ownerInfo.display}
                                  color={ownerInfo.color}
                                  variant={ownerInfo.variant}
                                  size="small"
                                />
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>{store.deliveryRadius} km</TableCell>
                          <TableCell>
                            <Chip
                              label={store.isActive ? 'Active' : 'Inactive'}
                              size="small"
                              sx={{
                                backgroundColor: store.isActive ? '#cdf0df' : '#f0f0f0',
                                color: store.isActive ? '#006644' : '#555',
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Edit Store">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(store)}
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="View Products">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewProducts(store)}
                                  color="info"
                                >
                                  <ProductsIcon />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete Store">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteClick(storeId, store.name)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalStores}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}

        {/* Mobile Pagination */}
        {isMobile && stores.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalStores}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows:"
              sx={{
                '& .MuiTablePagination-toolbar': {
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                },
                '& .MuiTablePagination-spacer': {
                  flex: 'none'
                }
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the store "{deleteDialog.storeName}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: isMobile ? 'bottom' : 'bottom',
          horizontal: isMobile ? 'center' : 'left'
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: isMobile ? '90%' : '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default StoreList;