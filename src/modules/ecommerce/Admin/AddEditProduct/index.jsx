import React, { useEffect, useState } from 'react';
import AppGridContainer from '@crema/components/AppGridContainer';
import { Fonts } from '@crema/constants/AppEnums';
import { Box } from '@mui/material';
import BlogSidebar from './Sidebar';
import ProductContent from './Content';
import { Form, Formik } from 'formik';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { postDataApi, uploadPutDataApi } from '@crema/hooks/APIHooks';
import { useNavigate } from 'react-router-dom';
import { getStringFromHtml } from '@crema/helpers/StringHelper';
import { mediaUrl } from "@crema/constants/AppConst.jsx";
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

export const AddEditProduct = ({ selectedProd, refetchProduct }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const infoViewActionsContext = useInfoViewActionsContext();
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = React.useState([
    { id: 1, title: '', desc: '' },
  ]);
  const [productSpec, setProductSpec] = React.useState([
    { id: 1, title: '', desc: '' },
  ]);

  useEffect(() => {
    if (selectedProd) {
      setSelectedTags(selectedProd?.tag || []);
      
      // Transform the images to the correct format for preview
      const formattedImages = selectedProd?.images?.map((img) => ({
        ...img,
        preview: `${mediaUrl}/product/${img.src}`, // Use mediaUrl to form the complete URL
        src: img.src,
        file: null // Add this to indicate it's an existing file
      })) || [];
      
      setUploadedFiles(formattedImages);
      setProductInfo(selectedProd?.productInfo || [{ id: 1, title: '', desc: '' }]);
      setProductSpec(selectedProd?.productSpec || [{ id: 1, title: '', desc: '' }]);
    }
  }, [selectedProd]);

  return (
    <>
      <Box
        component='h2'
        variant='h2'
        sx={{
          m: '20px 0 0 12px',
          fontSize: 16,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 4,
          },
        }}
      >
        {selectedProd ? 'Edit Product' : 'Create a new product'}
      </Box>

      <Formik
        validateOnChange={true}
        initialValues={
          selectedProd
            ? {
              ...selectedProd,
              category: selectedProd?.category.id || 1,
              inStock: selectedProd?.inStock || false, // Ensure inStock is explicitly included
            }
            : {
              title: '',
              SKU: '',
              category: 1,
              mrp: 0,
              salemrp: 0,
              discount: 0,
              inStock: false,
            }
        }
        onSubmit={async (data, { setSubmitting, resetForm }) => {
          setSubmitting(true);

          const formData = new FormData();
          
          // Ensure inStock is properly included in the product data
          const productData = {
            ...data,
            inStock: data.inStock || false, // Explicitly include inStock
          };
          
          // For existing products, append product data as JSON
          if (selectedProd) {
            formData.append('product', JSON.stringify({
              ...productData,
              id: selectedProd.id // Make sure the ID is included
            }));
          } else {
            formData.append('product', JSON.stringify(productData));
          }
          
          formData.append('productInfo', JSON.stringify(productInfo));
          formData.append('productSpec', JSON.stringify(productSpec));

          // Append all images, both existing and new
          uploadedFiles.forEach((file) => {
            if (file instanceof File) {
              formData.append('images[]', file);
            } else if (file.src) {
              // If it's an existing image, append it as a URL
              formData.append('existingImages[]', file.src);
            }
          });

          try {
            let response;
            
            if (selectedProd) {
              // Update existing product
              response = await uploadPutDataApi(`/product/${selectedProd.id}`, infoViewActionsContext, formData);
              infoViewActionsContext.showMessage('Product updated successfully!');
              
              // First refetch the product data
              if (refetchProduct && typeof refetchProduct === 'function') {
                await refetchProduct();
              }
              
              // Then navigate to product listing page
              navigate('/ecommerce/product-listing', { state: { refreshData: true } });
            } else {
              // Create new product
              response = await uploadPutDataApi('/product', infoViewActionsContext, formData);
              infoViewActionsContext.showMessage('Product created successfully!');
              
              // For new products, navigate to product details page
              if (refetchProduct && typeof refetchProduct === 'function') {
                await refetchProduct();
              }
              navigate(`/ecommerce/product-settings/${response.id}`);
            }
          } catch (error) {
            infoViewActionsContext.fetchError(error.message || 'Something went wrong');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, values }) => (
          <Form noValidate autoComplete='off'>
            <AppGridContainer>
              <ProductContent
                content={selectedProd?.description || ''}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                setFieldValue={setFieldValue}
              />
              <BlogSidebar
                isEdit={!!selectedProd}
                inStock={values.inStock}  // Pass current values.inStock instead of selectedProd?.inStock
                selectedTags={selectedTags}
                productInfo={productInfo}
                productSpec={productSpec}
                setProductInfo={setProductInfo}
                setFieldValue={setFieldValue}
                setSelectedTags={setSelectedTags}
                setProductSpec={setProductSpec}
              />
            </AppGridContainer>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddEditProduct;

AddEditProduct.propTypes = {
  selectedProd: PropTypes.object,
  refetchProduct: PropTypes.func,
};