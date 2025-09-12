import React, { useState, useEffect } from 'react';
import { useAddProductVariantMutation, useUpdateProductVariantMutation } from '@crema/Slices/productVariantSlice';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Typography, ListItemText, Snackbar, Alert, IconButton, CircularProgress, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../../../../@crema/Slices/productsSlice';
import { mediaUrl } from '../../../../../@crema/constants/AppConst';

const ImageDropzone = ({ onDrop, children }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    onDrop: onDrop,
    multiple: true, // Allow multiple files
    maxFiles: 5 // Limit to 5 files max
  });

  return (
    <Box {...getRootProps()}
      sx={{
        width: '120px',
        height: '56px',
        border: '2px dashed #eeeeee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: '4px',
      }}>
      <input {...getInputProps()} hidden />
      {children}
    </Box>
  );
};

const ProductVariantForm = ({ variantToEdit, onSave, selectedProd }) => {
  const { id } = useParams();
  const { data: productData, refetch: refetchProduct } = useGetProductByIdQuery(selectedProd?.id, {
    skip: !selectedProd?.id
  });

  const [addVariant, { isLoading: isAddingVariant }] = useAddProductVariantMutation();
  const [updateVariant, { isLoading: isUpdatingVariant }] = useUpdateProductVariantMutation();
  const navigate = useNavigate();

  const emptyVariant = {
    sku: '',
    quantity: '',
    type: '',
    color: '',
    size: '',
    price: '',
    images: [], // Changed from image to images array
  };

  const [variants, setVariants] = useState([emptyVariant]);
  const [formErrors, setFormErrors] = useState([{}]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalVariantId, setOriginalVariantId] = useState(null);

  // Reset form when variantToEdit changes
  useEffect(() => {
    if (variantToEdit) {
      console.log("Editing variant:", variantToEdit);

      // Save the original ID for later reference
      setOriginalVariantId(variantToEdit.id);

      // Extract color and size from attributes if they exist
      let color = '';
      let size = '';
      let type = '';

      if (variantToEdit.attributes) {
        const colorAttr = variantToEdit.attributes.find(attr => attr.name === "color");
        const sizeAttr = variantToEdit.attributes.find(attr => attr.name === "size");
        const typeAttr = variantToEdit.attributes.find(attr => attr.name === "type");

        if (colorAttr) {
          // Remove any quotes around the value
          color = colorAttr.value.replace(/^"|"$/g, '');
        }

        if (sizeAttr) {
          size = sizeAttr.value.replace(/^"|"$/g, '');
        }

        if (typeAttr) {
          type = typeAttr.value.replace(/^"|"$/g, '');
        }
      }

      // Handle existing images - convert single image to array if needed
      const existingImages = [];
      if (variantToEdit.image) {
        existingImages.push(variantToEdit.image);
      }
      // If variantToEdit has images array, use that instead
      if (variantToEdit.images && Array.isArray(variantToEdit.images)) {
        existingImages.splice(0, existingImages.length, ...variantToEdit.images);
      }

      setVariants([{
        id: variantToEdit.id,
        sku: variantToEdit.sku || '',
        quantity: variantToEdit.quantity || '',
        type: type || '',
        color: color || '',
        size: size || '',
        price: variantToEdit.price || '',
        images: existingImages, // Set as array
      }]);

      setShowPreview(existingImages.length > 0);
    } else {
      // Reset to empty form if not editing
      setVariants([emptyVariant]);
      setOriginalVariantId(null);
      setShowPreview(false);
    }
  }, [variantToEdit]);

  const handleAddVariant = () => {
    setVariants([...variants, { ...emptyVariant }]);
    setFormErrors([...formErrors, {}]);
  };

  const handleRemoveVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    const newErrors = formErrors.filter((_, i) => i !== index);
    setVariants(newVariants);
    setFormErrors(newErrors);
  };

  const handleChange = (index, name, value) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [name]: value,
    };
    setVariants(newVariants);
    if (name === 'image' && value) {
      setShowPreview(true);
    }
  };

  const handleImageDrop = (index) => (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      // Limit to 5 images
      const filesToAdd = acceptedFiles.slice(0, 5);

      // Create a copy of variants array
      const newVariants = [...variants];

      // Use the files in REVERSED order to fix the issue
      // This counteracts any reversal that might be happening elsewhere
      newVariants[index] = {
        ...newVariants[index],
        images: [...filesToAdd].reverse(), // Reverse the array to fix the order
      };

      setVariants(newVariants);
      setShowPreview(true);
    }
  };

  const handleRemoveImage = (variantIndex, imageIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images.splice(imageIndex, 1);
    setVariants(newVariants);

    // Hide preview if no images left
    if (newVariants[variantIndex].images.length === 0) {
      setShowPreview(false);
    }
  };

  // Helper function to get image URL with proper error handling
  const getImageSrc = (image) => {
    try {
      if (image instanceof File) {
        return URL.createObjectURL(image);
      }

      if (typeof image === 'string') {
        return `${mediaUrl}/product/${image}`;
      }
    } catch (error) {
      console.error("Error creating image URL:", error);
    }

    return '/assets/images/placeholder.jpg';
  };

  // Function to check for duplicate combinations
  const checkForDuplicates = (variants) => {
    // Get existing variants from the product data
    const existingVariants = productData?.variant || [];

    // Create a map of existing combinations (excluding the variant being edited)
    const existingCombinations = new Map();

    existingVariants.forEach(variant => {
      // Skip the variant currently being edited
      if (variant.id === originalVariantId) return;

      // Extract attribute values
      let color = '';
      let size = '';
      let type = '';

      if (variant.attributes) {
        const colorAttr = variant.attributes.find(attr => attr.name === "color");
        const sizeAttr = variant.attributes.find(attr => attr.name === "size");
        const typeAttr = variant.attributes.find(attr => attr.name === "type");

        color = colorAttr ? colorAttr.value.replace(/^"|"$/g, '') : '';
        size = sizeAttr ? sizeAttr.value.replace(/^"|"$/g, '') : '';
        type = typeAttr ? typeAttr.value.replace(/^"|"$/g, '') : '';
      }

      // Create a combination key
      const key = `${color}|${size}|${type}`;
      existingCombinations.set(key, variant);
    });

    // Check each variant in the form for duplicates
    let hasDuplicates = false;
    const newErrors = [...formErrors];

    // First check for duplicates within the form variants
    const formCombinations = new Map();
    variants.forEach((variant, index) => {
      const key = `${variant.color}|${variant.size}|${variant.type}`;

      if (formCombinations.has(key)) {
        hasDuplicates = true;
        newErrors[index] = {
          ...newErrors[index],
          // duplicate: 'This combination of color, size, and type already exists in your form'
        };
      } else {
        formCombinations.set(key, index);
      }

      // Then check against existing variants in the database
      if (existingCombinations.has(key)) {
        hasDuplicates = true;
        newErrors[index] = {
          ...newErrors[index],
          // duplicate: 'This combination of color, size, and type already exists for this product'
        };
      }
    });

    if (hasDuplicates) {
      setFormErrors(newErrors);
    }

    return hasDuplicates;
  };

  const validateForm = (variant, index) => {
    const newErrors = { ...formErrors[index] };
    let isValid = true;

    if (!variant.sku) {
      newErrors.sku = 'SKU is required';
      isValid = false;
    }

    if (!variant.quantity) {
      newErrors.quantity = 'Quantity is required';
      isValid = false;
    } else if (isNaN(variant.quantity) || parseInt(variant.quantity) < 0) {
      newErrors.quantity = 'Quantity must be positive number';
      isValid = false;
    }

    if (!variant.price) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(variant.price)) {
      newErrors.price = 'Price must be a number';
      isValid = false;
    }

    // Update form errors
    const updatedErrors = [...formErrors];
    updatedErrors[index] = newErrors;
    setFormErrors(updatedErrors);

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all variants
      const allValid = variants.every((variant, index) => validateForm(variant, index));

      if (!allValid) {
        setIsSubmitting(false);
        setSnackbar({
          open: true,
          message: 'Please fix the form errors before submitting.',
          severity: 'error',
        });
        return;
      }

      // Check for duplicate combinations
      const hasDuplicates = checkForDuplicates(variants);
      if (hasDuplicates) {
        setIsSubmitting(false);
        setSnackbar({
          open: true,
          message: 'Duplicate variants detected. Please check the form for errors.',
          severity: 'error',
        });
        return;
      }

      // Process each variant one by one
      const savedVariants = [];

      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        const formData = new FormData();

        formData.append('sku', variant.sku);
        formData.append('quantity', variant.quantity);
        formData.append('productId', selectedProd.id);
        formData.append('price', variant.price);

        const attributes = [
          { name: "color", value: variant.color || "" },
          { name: "size", value: variant.size || "" },
          { name: "type", value: variant.type || "" }
        ];

        if (variant.type) formData.append('type', variant.type);
        if (variant.color) formData.append('color', variant.color);
        if (variant.size) formData.append('size', variant.size);
        formData.append('attributes', JSON.stringify(attributes));

        // Append each image to the formData - maintain order
        if (variant.images && variant.images.length > 0) {
          // Important: maintain the same order as in the UI
          variant.images.forEach((img, imgIndex) => {
            if (img instanceof File) {
              formData.append(`images`, img);
            }
          });

          formData.append('imageCount', variant.images.length);
        }

        let response;

        // For the first variant, use originalVariantId if it exists
        if (i === 0 && originalVariantId) {
          response = await updateVariant({
            id: originalVariantId,
            body: formData
          }).unwrap();
        } else {
          // Add new variant
          response = await addVariant(formData).unwrap();
        }

        // Construct the updated variant object
        const updatedVariant = {
          id: (i === 0 && originalVariantId) ? originalVariantId : response.id,
          sku: variant.sku,
          quantity: variant.quantity,
          price: variant.price,
          productId: selectedProd.id,
          images: response.images || (response.image ? [response.image] : []),
          image: response.image, // Keep for backward compatibility
          attributes: [
            { name: "color", value: variant.color || "" },
            { name: "size", value: variant.size || "" },
            { name: "type", value: variant.type || "" }
          ]
        };

        savedVariants.push(updatedVariant);
      }

      // Refresh product data
      await refetchProduct();

      // Notify parent component about all saved variants
      savedVariants.forEach(variant => onSave(variant));

      setSnackbar({
        open: true,
        message: originalVariantId ?
          'Variants Updated Successfully' :
          `${savedVariants.length} Variants Added Successfully`,
        severity: 'success',
      });

      // Reset form state
      setVariants([emptyVariant]);
      setShowPreview(false);
      setOriginalVariantId(null);

    } catch (error) {
      console.error("Error saving variants:", error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save product variants. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, marginLeft: "22px", overflow: "auto" }}>
      {variants.map((variant, index) => (
        <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {originalVariantId ? 'Edit Variant' : `Variant ${index + 1}`}
            </Typography>
            {variants.length > 1 && (
              <IconButton onClick={() => handleRemoveVariant(index)} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          {/* Display duplicate error message if it exists */}
          {formErrors[index]?.duplicate && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formErrors[index].duplicate}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5 }}>

            <TextField
              label="SKU"
              value={variant.sku || ''}
              onChange={(e) => handleChange(index, 'sku', e.target.value)}
              fullWidth
              margin="normal"
              sx={{ width: '120px !important' }}
              error={Boolean(formErrors[index]?.sku)}
              helperText={formErrors[index]?.sku}
            />
            <TextField
              label="Quantity"
              value={variant.quantity || ''}
              onChange={(e) => handleChange(index, 'quantity', e.target.value)}
              fullWidth
              margin="normal"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              sx={{ width: '120px !important' }}
              error={Boolean(formErrors[index]?.quantity)}
              helperText={formErrors[index]?.quantity}
            />

            {selectedProd?.category?.name === "Safety Shirts" && (
              <>
                <FormControl sx={{ width: '100px' }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={variant.type || ''}
                    onChange={(e) => handleChange(index, 'type', e.target.value)}
                    label="Type"
                    error={Boolean(formErrors[index]?.type)}
                  >
                    <MenuItem value={'V-neck'}>V-neck</MenuItem>
                    <MenuItem value={'Crew Neck'}>Crew Neck</MenuItem>
                    <MenuItem value={'Polo'}>Polo</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ width: '100px' }}>
                  <InputLabel>Color</InputLabel>
                  <Select
                    value={variant.color || ''}
                    onChange={(e) => handleChange(index, 'color', e.target.value)}
                    label="Color"
                    error={Boolean(formErrors[index]?.color)}
                  >
                    {['Grey w/ Yellow Visibility Trim', 'Navy w/ Yellow Visibility Trim',
                      'Fluorescent Yellow', 'Fluorescent Orange'].map((color) => (
                        <MenuItem key={color} value={color}>
                          <ListItemText primary={color} />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </>
            )}

            <FormControl sx={{ width: '100px' }}>
              <InputLabel>Size</InputLabel>
              <Select
                value={variant.size || ''}
                onChange={(e) => handleChange(index, 'size', e.target.value)}
                label="Size"
                error={Boolean(formErrors[index]?.size)}
              >
                {selectedProd?.category?.name === "Truck Tyres"
                  ? ['70R 19.5', '70R 22.5'].map((size) => (
                    <MenuItem key={size} value={size}>
                      <ListItemText primary={size} />
                    </MenuItem>
                  ))
                  : ['S', 'M', 'L', 'XL', 'XXL', '3XL'].map((size) => (
                    <MenuItem key={size} value={size}>
                      <ListItemText primary={size} />
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }}>
              <TextField
                label="Price"
                value={variant.price || ''}
                onChange={(e) => handleChange(index, 'price', e.target.value)}
                fullWidth
                margin="normal"
                sx={{ width: '120px !important' }}
                error={Boolean(formErrors[index]?.price)}
                helperText={formErrors[index]?.price}
              />

              <ImageDropzone onDrop={handleImageDrop(index)}>
                <Typography variant="caption" sx={{ textAlign: 'center' }}>
                  Upload Images
                </Typography>
                <img
                  src={'/assets/icon/upload.svg'}
                  alt="Upload"
                  style={{ width: '24px', height: '24px' }}
                />
              </ImageDropzone>
            </Box>
          </Box>

          {/* Image preview section - shown when images are available */}
          {showPreview && variant.images && variant.images.length > 0 && (
            <Box sx={{ m: 1, mt: 2 }}>
              <Typography variant="subtitle1">Image Previews:</Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {variant.images.map((img, imgIndex) => (
                  <Grid item key={imgIndex} xs={4} sm={3} md={2}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={getImageSrc(img)}
                        alt={`Product ${imgIndex + 1}`}
                        onError={(e) => { e.target.src = '/assets/images/placeholder.jpg' }}
                        style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          backgroundColor: 'rgba(255,255,255,0.7)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.9)',
                          }
                        }}
                        onClick={() => handleRemoveImage(index, imgIndex)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      ))}

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        {!originalVariantId && (
          <Button
            onClick={handleAddVariant}
            variant="outlined"
            startIcon={<AddIcon />}
            disabled={isSubmitting}
          >
            Add Another Variant
          </Button>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            originalVariantId ? 'Update Variant' : 'Save Variants'
          )}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{
          width: "100%",
          backgroundColor: snackbar.severity === "success" ? "#43a047" : "#d32f2f",
          color: "white",
          fontWeight: "bold",
          "& .MuiSvgIcon-root": { color: "white" },
          padding: "2px 10px",
          minHeight: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductVariantForm;