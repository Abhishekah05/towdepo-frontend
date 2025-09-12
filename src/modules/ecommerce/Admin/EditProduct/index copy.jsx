import React, { useEffect, useState } from 'react';
import AppGridContainer from '@crema/components/AppGridContainer';
import { Fonts } from '@crema/constants/AppEnums';
import { Box } from '@mui/material';
import BlogSidebar from '../AddEditProduct/Sidebar';
import ProductContent from '../AddEditProduct/Content';
import { Form, Formik } from 'formik';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from '../../../../@crema/Slices/productsSlice';
import { mediaUrl } from '../../../../@crema/constants/AppConst';

export const ProductEditPage = () => {
  const { id } = useParams();
  const { data: selectedProd, isLoading, isError } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [selectedTags, setSelectedTags] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const infoViewActionsContext = useInfoViewActionsContext();
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState([
    { id: 1, title: '', desc: '' },
  ]);
  const [productSpec, setProductSpec] = useState([
    { id: 1, title: '', desc: '' },
  ]);

  // Process the fetched product data
  useEffect(() => {
    if (!isLoading && selectedProd) {
      setSelectedTags(selectedProd?.tag || []);

      // Ensure images are correctly formatted
      let productImages = selectedProd?.images || [];

      if (Array.isArray(productImages) && productImages.length > 0) {
        const processedImages = productImages.map((img) => ({
          id: img.id || `image-${Date.now()}`,
          // preview: img.src.startsWith('http') ? img.src : `${mediaUrl}/product/${img.src}`,
          // src: img.src.startsWith('http') ? img.src : `${mediaUrl}/product/${img.src}`,
          name: img.name || img.src || `image-${Date.now()}`,
          type: img.type || 'image/jpeg',
        }));
        setUploadedFiles(processedImages);
      } else {
        setUploadedFiles([]); // Set an empty array if no images exist
      }

      setProductInfo(selectedProd?.productInfo || [{ id: 1, title: '', desc: '' }]);
      setProductSpec(selectedProd?.productSpec || [{ id: 1, title: '', desc: '' }]);
    }
  }, [selectedProd, isLoading]);

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching product data</div>;

  return (
    <>
      <Box
        component='h2'
        variant='h2'
        sx={{
          fontSize: 16,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 4,
            lg: 4,
          },
        }}
      >
        Edit Product 
      </Box>
      <Formik
        initialValues={{
          ...selectedProd,
          category: selectedProd?.category?.id || selectedProd?.category || 1,
          images: uploadedFiles.length > 0 ? uploadedFiles : (selectedProd?.images || []).map(img => ({
            id: img.id || `image-${Date.now()}`,
            // preview: img.src?.startsWith('http') ? img.src : `${mediaUrl}/product/${img.src}`,
            // src: img.src.startsWith('http') ? img.src : `${mediaUrl}/product/${img.src}`,
            name: img.name || img.src || `image-${Date.now()}`,
            type: img.type || 'image/jpeg',
          })),
        }}
        enableReinitialize={true}
        onSubmit={async (data, { setSubmitting }) => {


          console.log("Processed files")
          console.log(uploadedFiles);
          return false;

          // Only use the current uploadedFiles for the update
          // This ensures new images replace old ones
          const processedImages = uploadedFiles
            .filter(file => file.src) // Ensure only valid images are kept
            .map(file => ({
              src: file.src.includes(`${mediaUrl}/product/`)
                ? file.src.replace(`${mediaUrl}/product/`, '')  // Remove mediaUrl for existing images
                : file.src, // Keep full URL for newly uploaded ones
              id: file.id || `image-${Date.now()}`,
              name: file.name || `image-${Date.now()}`,
              type: file.type || 'image/jpeg',
            }));

            console.log("Processed files")
            console.log(processedImages);
            // return false;
            setSubmitting(true);
          const updatedProd = {
            ...selectedProd,
            ...data,
            productInfo,
            productSpec,
            images: processedImages, // This now completely replaces the old images array
            updatedAt: dayjs().format('DD MMM YYYY'),
          };

          try {
            await updateProduct({ id, ...updatedProd }).unwrap();
            infoViewActionsContext.showMessage('Product updated successfully!');
            navigate('/ecommerce/product-listing');
          } catch (error) {
            infoViewActionsContext.fetchError(error.message || 'Failed to update product');
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
                setUploadedFiles={(files) => {

                  console.log(files);
                  // Completely replace the existing files with the new ones
                  setUploadedFiles(files);
                  setFieldValue('images', files); // Update formik field
                }}
                setFieldValue={setFieldValue}
              />
              <BlogSidebar
                isEdit={true}
                inStock={values.inStock}
                selectedTags={selectedTags}
                productInfo={productInfo}
                productSpec={productSpec}
                setProductInfo={setProductInfo}
                setFieldValue={setFieldValue}
                setSelectedTags={(tags) => {
                  setSelectedTags(tags);
                  setFieldValue('tag', tags); // Update formik field
                }}
                setProductSpec={setProductSpec}
              />
            </AppGridContainer>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ProductEditPage;