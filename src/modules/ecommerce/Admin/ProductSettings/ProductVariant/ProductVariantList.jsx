import React, { useState, useEffect } from 'react';
import { useGetProductVariantsQuery, useDeleteProductVariantMutation } from '@crema/Slices/productVariantSlice';
import { useGetProductByIdQuery } from '@crema/Slices/productsSlice';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Checkbox
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { mediaUrl } from "@crema/constants/AppConst.jsx";
import { Fonts } from '@crema/constants/AppEnums';

const ProductVariantList = ({ onEdit, selectedProd, onVariantUpdated }) => {
  const { data: productData, isLoading: isLoadingProduct, refetch: refetchProduct } = 
    useGetProductByIdQuery(selectedProd?.id, { 
      skip: !selectedProd?.id,
      refetchOnMountOrArgChange: true
    });
  
  const [deleteVariant] = useDeleteProductVariantMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [localVariants, setLocalVariants] = useState([]);
  
  const isLoading = isLoadingProduct;

  useEffect(() => {
    if (productData?.variant) {
      setLocalVariants(productData.variant);
    } else if (selectedProd?.variant) {
      setLocalVariants(selectedProd.variant);
    }
  }, [selectedProd, productData]);
  

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  if (!localVariants && !isLoading) return <Typography color="error">No variant data available</Typography>;

  const handleEditClick = (variant) => {
    onEdit(variant);
  };

  const handleSelectVariant = (variant) => {
    setSelectedVariants(prev => 
      prev.includes(variant) 
        ? prev.filter(v => v !== variant)
        : [...prev, variant]
    );
  };

  const handleSelectAllVariants = () => {
    if (selectedVariants.length === localVariants.length) {
      setSelectedVariants([]);
    } else {
      setSelectedVariants([...localVariants]);
    }
  };

  const handleDeleteClick = () => {
    if (selectedVariants.length > 0) {
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const deletePromises = selectedVariants.map(variant => 
        deleteVariant(variant.id).unwrap()
      );

      await Promise.all(deletePromises);
      
      await refetchProduct();
      
      if (onVariantUpdated) {
        onVariantUpdated();
      }

      setSnackbar({ 
        open: true, 
        message: `${selectedVariants.length} Variant${selectedVariants.length > 1 ? 's' : ''} Deleted Successfully`, 
        severity: 'success' 
      });

      setSelectedVariants([]);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete variants', severity: 'error' });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getAttributeValue = (variant, attributeName) => {
    if (!variant || !variant.attributes) return "N/A";
    
    const attribute = variant.attributes.find(attr => attr.name === attributeName);
    if (!attribute) {
      return variant[attributeName] ? variant[attributeName] : "N/A";
    }
    
    return attribute.value?.replace(/^"|"$/g, '') || "N/A";
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            paddingLeft: "3px", 
            fontWeight: Fonts.SEMI_BOLD 
          }}
        >
          Existing Variant Details
        </Typography>
        
        {selectedVariants.length > 0 && (
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeleteClick}
            sx={{ 
              backgroundColor: '#F26337', 
              '&:hover': { backgroundColor: '#FF7875' } 
            }}
          >
            Delete ({selectedVariants.length})
          </Button>
        )}
      </Box>

      {localVariants?.length > 0 ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Checkbox
              checked={selectedVariants.length === localVariants.length}
              indeterminate={
                selectedVariants.length > 0 && 
                selectedVariants.length < localVariants.length
              }
              onChange={handleSelectAllVariants}
            />
            <Typography>Select All</Typography>
          </Box>

          {localVariants.map((variant) => (
            <Paper
              key={variant.id}
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 2,
                backgroundColor: selectedVariants.includes(variant) 
                  ? 'rgba(255, 77, 79, 0.1)' 
                  : 'white',
                border: selectedVariants.includes(variant) 
                  ? '1px solid #FF4D4F' 
                  : '1px solid transparent'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Checkbox
                  checked={selectedVariants.includes(variant)}
                  onChange={() => handleSelectVariant(variant)}
                />
                <img
                  src={variant.images[0] ? `${mediaUrl}/product/${variant.images[0]}` : '/assets/images/placeholder.jpg'}
                  alt="Variant"
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onError={(e) => (e.target.src = '/assets/images/placeholder.jpg')}
                />
                <Box>
                  <Typography><strong>SKU:</strong> {variant.sku}</Typography>
                  <Typography><strong>Quantity:</strong> {variant.quantity || 0}</Typography>

                  {selectedProd?.category?.name === "Safety Shirts" && (
                    <>
                      <Typography>
                        <strong>Color:</strong> {getAttributeValue(variant, "color")}
                      </Typography>
                      <Typography>
                        <strong>Type:</strong> {getAttributeValue(variant, "type")}
                      </Typography>
                    </>
                  )}
                  <Typography>
                    <strong>Size:</strong> {getAttributeValue(variant, "size")}
                  </Typography>

                  <Typography><strong>Price:</strong> ${variant.price}</Typography>
                </Box>
              </Box>

              <Box>
                <IconButton
                  onClick={() => handleEditClick(variant)}
                  size="small"
                  sx={{ color: 'black', mr: 1 }}
                >
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSelectedVariants([variant]);
                    setDeleteDialogOpen(true);
                  }}
                  color="error"
                  size="small"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </>
      ) : (
        <Typography sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          No variants available for this product
        </Typography>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedVariants.length} variant{selectedVariants.length > 1 ? 's' : ''}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary" variant='outlined'>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{
            width: "100%",
            backgroundColor: snackbar.severity === 'success' ? "#43a047" : "#d32f2f", 
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
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductVariantList;