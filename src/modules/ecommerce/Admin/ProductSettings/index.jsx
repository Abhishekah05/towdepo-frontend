import React, { useEffect, useState } from 'react';
import AppGridContainer from '@crema/components/AppGridContainer';
import { Fonts } from '@crema/constants/AppEnums';
import { Box, Divider, IconButton } from '@mui/material';
import BlogSidebar from './Sidebar';
import ProductContent from './Content';
import ProductVariant from './ProductVariant'
import { Form, Formik } from 'formik';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { postDataApi, putDataApi, uploadPutDataApi } from '@crema/hooks/APIHooks';
import { useNavigate } from 'react-router-dom';
import { getStringFromHtml } from '@crema/helpers/StringHelper';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../../../@crema/Slices/productsSlice';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import PropTypes from 'prop-types';


export const AddEditProduct = ({ selectedProd, id }) => {
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
      setUploadedFiles(
        selectedProd?.images.map((img) => ({ ...img, preview: img.src })),
      );
      setProductInfo(selectedProd?.productInfo);
      setProductSpec(selectedProd?.productSpec);
    }
  }, [selectedProd]);

  return (
    <>
      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* Back Icon */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            color: "rgb(129, 129, 129)",
            position: "absolute",
            left: -25, // Align to the left
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 25 }} />
        </IconButton>

        {/* Heading */}
        <Box
          component="h2"
          variant="h2"
          sx={{
            fontSize: 16,
            color: "text.primary",
            fontWeight: Fonts.SEMI_BOLD,
            marginLeft: "30px", // Space for the icon
            mt: {
              xs: 6,
              lg: 8,
            },
          }}
        >
          {selectedProd ? "Edit Product" : "Create a new product"}
        </Box>
      </Box>


      <Formik
        validateOnChange={true}
        initialValues={
          selectedProd
            ? {
              ...selectedProd,
              category: selectedProd?.category || 1,
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
        onSubmit={(data, { setSubmitting, resetForm }) => {
          setSubmitting(true);

          const formData = new FormData();

          formData.append('product', JSON.stringify(data));
          formData.append('productInfo', JSON.stringify(productInfo));
          formData.append('productSpec', JSON.stringify(productSpec));


          for (let i = 0; i < uploadedFiles.length; i++) {
            formData.append('images[]', uploadedFiles[i]);
          }

          if (selectedProd) {
            const updatedProd = {
              ...selectedProd,
              ...data,
            };
            putDataApi(`/product/${id}`, infoViewActionsContext, {
              product: updatedProd,
            })
              .then(() => {
                navigate('');
                infoViewActionsContext.showMessage(
                  'Product updated successfully!',
                );
              })
              .catch((error) => {
                infoViewActionsContext.fetchError(error.message);
              });
          } else {
            uploadPutDataApi('/product', infoViewActionsContext,
              formData
              // {

              // product: {
              //   ...data,
              //   description: getStringFromHtml(data.description),
              //   // image: uploadedFiles.map((file, index) => ({
              //   //   id: index,
              //   //   src: file.preview,
              //   //   rating: 0,
              //   //   reviews: 0,
              //   // })),
              //   createdAt: dayjs().format('DD MMM YYYY'),
              //   inStock: data?.inStock || false,
              //   tag: selectedTags,
              //   productInfo,
              //   productSpec,
              // },
              // }
            )
              .then(() => {
                infoViewActionsContext.showMessage(
                  'Product created successfully!',
                );
                navigate('');
              })
              .catch((error) => {
                infoViewActionsContext.fetchError(error.message);
              });
          }
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ setFieldValue }) => (
          <Form noValidate autoComplete='off'>
            <AppGridContainer>
              <ProductContent
                content={selectedProd?.description || ''}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                setFieldValue={setFieldValue}
              />


            </AppGridContainer>
          </Form>
        )}
      </Formik>
      <br />
      <ProductVariant selectedProd={selectedProd} />
    </>
  );
};

export default AddEditProduct;

AddEditProduct.propTypes = {
  selectedProd: PropTypes.object,
};
