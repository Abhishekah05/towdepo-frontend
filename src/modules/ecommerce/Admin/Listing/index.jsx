import React, { useState, useEffect } from 'react';
import { Box, Grid, Hidden, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Slide, Snackbar, Alert } from '@mui/material';
import { useIntl } from 'react-intl';
import AppGridContainer from '@crema/components/AppGridContainer';
import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import AppCard from '@crema/components/AppCard';
import AppSearchBar from '@crema/components/AppSearchBar';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import AppsPagination from '@crema/components/AppsPagination';
import ListingTable from './ListingTable';
import FilterItem from './FilterItem';
import { 
  useGetProductsByOwnerQuery, 
  useDeleteProductMutation,
  useGetStoresByOwnerQuery 
} from '@crema/Slices/productsSlice';
import { Fonts } from '@crema/constants/AppEnums';
import AppLoader from '@crema/components/AppLoader';
import { useLocation } from 'react-router-dom';
import { useAuthUser } from '../../../../@crema/hooks/AuthHooks';

const ProductListing = () => {
  const { messages } = useIntl();
  const location = useLocation();
  
  // Get owner ID from URL params, localStorage, or props
  // You can modify this based on how you get the owner ID
  const {user: currentUser} = useAuthUser(); // Replace with actual owner ID source
  // Get owner ID from navigation state or use current user
const ownerId = location.state?.ownerId || currentUser?.id;

console.log("Owner ID for products:", ownerId);
  console.log("owner",ownerId)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterData, setFilterData] = useState({
    title: '',
    inStock: [],
    mrp: { start: 0, end: 30000 },
  });
  const itemsPerPage = 10;
  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch products by owner ID
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError, 
    refetch: refetchProducts 
  } = useGetProductsByOwnerQuery(ownerId?.id || ownerId);

  // Fetch stores by owner ID (optional - if you want to show store info)
  const { 
    data: storesData, 
    isLoading: storesLoading,
    error: storesError 
  } = useGetStoresByOwnerQuery(ownerId?.id || ownerId);

  const [deleteProduct] = useDeleteProductMutation();

  // Effect to check if we're coming from the edit page with a refresh flag
  useEffect(() => {
    if (location.state?.refreshData) {
      refetchProducts();
      // Clear the state after refetching to avoid multiple refetches
      window.history.replaceState({}, document.title);
    }
  }, [location, refetchProducts]);

  // Handle loading state
  if (productsLoading || storesLoading) {
    return <AppLoader />;
  }

  // Handle error state
  if (productsError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error">
          Error loading products: {productsError.message}
        </Alert>
      </Box>
    );
  }

  const products = productsData?.products || [];
  const totalResults = productsData?.totalResults || 0;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const onPageChange = (event, value) => {
    setPage(value);
  };

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(selectedProductId);
      refetchProducts();
      setOpenDialog(false);
      setSnackbarMessage('Product deleted successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting the product:', error);
      setOpenDialog(false);
      setSnackbarMessage('Error deleting the product.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false);
    setSelectedProductId(null);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const searchProduct = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  // Filter products based on search and filter criteria
  const filteredProducts = products.filter(product =>
    (filterData.inStock === null || product.inStock === filterData.inStock) &&
    (product.title?.toLowerCase().includes(searchQuery) ||
     product.sku?.toLowerCase().includes(searchQuery) ||
     product.status?.toLowerCase().includes(searchQuery)) &&
    (product.mrp >= filterData.mrp.start && product.mrp <= filterData.mrp.end)
  );

  // Paginate filtered products
  const paginatedProducts = filteredProducts.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  // Get store names for display (optional)
  const storeNames = storesData?.stores?.map(store => store.name).join(', ') || 'Multiple Stores';

  return (
    <>
      <Box component='h2' sx={{ 
        fontSize: 18, 
        color: 'text.primary', 
        fontWeight: Fonts.SEMI_BOLD, 
        mb: { xs: 3, lg: 5 }, 
        mt: { xs: 3, lg: 5 } 
      }}>
        {messages['sidebar.ecommerceAdmin.productListing']}
        {storesData?.stores && (
          <Box component="span" sx={{ 
            fontSize: 14, 
            color: 'text.secondary', 
            fontWeight: Fonts.NORMAL,
            ml: 2
          }}>
            (Stores: {storeNames})
          </Box>
        )}
      </Box>
      
      <AppGridContainer spacing={7}>
        {/* Filter Section */}
        <Slide direction='left' in mountOnEnter unmountOnExit>
          <Grid item xs={12} lg={3}>
            <FilterItem filterData={filterData} setFilterData={setFilterData} />
          </Grid>
        </Slide>

        {/* Product Table Section */}
        <Slide direction='right' in mountOnEnter unmountOnExit>
          <Grid item xs={12} lg={9}>
            <AppCard 
              title={
                <AppsHeader>
                  <Box display='flex' flexDirection='row' alignItems='center' width={1} justifyContent='space-between'>
                    <AppSearchBar 
                      iconPosition='right' 
                      overlap={false} 
                      onChange={(event) => searchProduct(event.target.value)} 
                      placeholder={messages['common.searchHere']} 
                    />
                    <Box display='flex' flexDirection='row' alignItems='center' justifyContent='flex-end'>
                      <Hidden smDown>
                        <AppsPagination 
                          rowsPerPage={itemsPerPage} 
                          count={totalResults} 
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
                              mt: 5,
                              fontSize: "12px",
                              color: "#535c69",
                            },
                            ".MuiTablePagination-displayedRows": {
                              mt: 5,
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
              } 
              headerStyle={{ p: 0 }} 
              contentStyle={{ p: 0 }}
            >
              <AppsContent sx={{ paddingTop: 2.5, paddingBottom: 2.5 }}>
                <ListingTable 
                  productData={paginatedProducts} 
                  loading={productsLoading} 
                  handleDeleteClick={handleDeleteClick} 
                />
              </AppsContent>
              <Hidden smUp>
                <AppsPagination 
                  rowsPerPage={itemsPerPage} 
                  count={filteredProducts.length} 
                  page={page} 
                  onPageChange={onPageChange} 
                />
              </Hidden>
            </AppCard>
          </Grid>
        </Slide>
      </AppGridContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleDeleteCancel}>
        <DialogTitle sx={{ fontSize: "17px" }}>
          {messages['common.deleteConfirmation']}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {messages['common.deleteConfirmationMessage']}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary" variant='outlined'>
            {messages['common.cancel']}
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" variant='contained'>
            {messages['common.delete']}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            backgroundColor: snackbarSeverity === 'success' ? "#43a047" : "#d32f2f",
            color: "white",
            fontWeight: "bold",
            "& .MuiSvgIcon-root": { color: "white" },
            padding: "2px 10px", 
            minHeight: "28px", 
            display: "flex",
            alignItems: "center", 
            justifyContent: "center", 
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductListing;