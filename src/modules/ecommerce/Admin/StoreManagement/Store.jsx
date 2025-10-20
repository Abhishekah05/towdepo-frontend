// pages/Stores/Stores.js
import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import StoreList from './StoreTable';
import StoreForm from './StoreForm';
import { postDataApi, putDataApi, deleteDataApi } from '@crema/hooks/APIHooks';

const Stores = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const infoViewActionsContext = useInfoViewActionsContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Function to trigger refresh
  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleAddStore = () => {
    setEditingStore(null);
    setIsFormOpen(true);
  };

  const handleEditStore = (store) => {
    console.log('Edit store received:', store);
    setEditingStore(store);
    setIsFormOpen(true);
  };

  const getStoreId = (store) => {
    return store?.id || store?._id;
  };


  //add and Update store Api Call
  const handleSaveStore = async (storeData) => {
    try {
      console.log('Saving store data:', storeData);

      if (editingStore) {
        const storeId = getStoreId(editingStore);

        if (!storeId) {
          throw new Error('Store ID is missing');
        }

        await putDataApi(
          `/store/${storeId}`,
          infoViewActionsContext,
          storeData
        );
        showSnackbar('Store updated successfully!');
      } else {
        await postDataApi(
          '/store',
          infoViewActionsContext,
          storeData
        );
        showSnackbar('Store created successfully!');
      }

      setIsFormOpen(false);
      setEditingStore(null);
      triggerRefresh();

    } catch (error) {
      console.error('Error saving store:', error);
      showSnackbar(error.message || 'Error saving store', 'error');
    }
  };


  //Delete Api Call 
  const handleDeleteStore = async (storeId) => {
    try {
      console.log('Deleting store with ID:', storeId);

      if (!storeId) {
        throw new Error('Store ID is missing');
      }

      await deleteDataApi(
        `/store/${storeId}`,
        infoViewActionsContext
      );
      showSnackbar('Store deleted successfully!');
      triggerRefresh();
      return Promise.resolve();
    } catch (error) {
      showSnackbar(error.message || 'Error deleting store', 'error');
      return Promise.reject(error);
    }
  };


  const handleViewProducts = (storeId) => {
    window.location.href = `/products?store=${storeId}`;
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStore(null);
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2,
        mb: 3
      }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          sx={{ textAlign: isMobile ? 'center' : 'left' }}
        >
          Store Management
        </Typography>
      </Box>

      <StoreList
        key={refreshKey}
        onAdd={handleAddStore}
        onEdit={handleEditStore}
        onDelete={handleDeleteStore}
        onViewProducts={handleViewProducts}
      />

      <StoreForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveStore}
        initialData={editingStore}
        isEdit={!!editingStore}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{
          vertical: isMobile ? 'bottom' : 'bottom',
          horizontal: isMobile ? 'center' : 'left'
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ width: isMobile ? '90%' : '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Stores;