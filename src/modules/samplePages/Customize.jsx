import React, { useState } from 'react';
import { Typography, Grid, IconButton, TextField, Box, Button, Snackbar, Alert, Tabs, Tab } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useCreateCustomizationMutation, useGetCustomizationQuery } from '@crema/Slices/customizationApiSlice';
import { styled } from '@mui/system';
import { mediaUrl } from "@crema/constants/AppConst";
import { Fonts } from '@crema/constants/AppEnums';


const Input = styled('input')({
  display: 'none',
});

const ImagePreview = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  borderRadius: '8px',
  maxWidth: '300px',
  margin: '0 auto',
  marginBottom:"250px"
});

const LogoDropArea = styled(Box)({
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  padding: '30px',
  textAlign: 'center',
  cursor: 'pointer',
  color: '#757575',
  margin: '10px 0',
  border: '1px dashed #ccc',
  height: '120px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative', // Added to contain absolutely positioned children
  overflow: 'hidden', // Ensures content doesn't overflow
});

const LogoPreviewWrapper = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
});

const UploadIcon = styled(Box)({
  marginBottom: '8px',
});

const TabContent = styled(Box)({
  paddingTop: 20,
});

const CustomizationContainer = styled(Box)({
  backgroundColor: 'white',
  width: '800px',
  maxWidth: '100%',
  borderRadius: 0,
  display: 'flex',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  margin: '0 auto',
  position: 'relative',
  height: '100vh',
});

const ProductImageSection = styled(Box)({
  width: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  backgroundColor: '#fff',
});

const CustomizationSection = styled(Box)({
  width: '50%',
  padding: '30px',
  backgroundColor: 'white',
  borderLeft: '1px solid #eee',
  overflowY: 'auto',
  height: '100%',
});

const SaveButton = styled(Button)({
  backgroundColor: '#f36f21',
  color: 'white',
  '&:hover': {
    backgroundColor: '#e05e10',
  },
  width: '100%',
  padding: '12px',
  marginTop: '20px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'normal',
  borderRadius: '4px',
});

const StyledTabs = styled(Tabs)({
  '& .MuiTab-root': {
    textTransform: 'uppercase',
    fontWeight: 500,
    fontSize: '14px',
    minWidth: 'unset',
    flex: 1,
    padding: '12px 16px',
  },
  '& .Mui-selected': {
    color: '#f36f21',
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#f36f21',
  },
  borderBottom: '1px solid #eee',
});



const LogoPositionGrid = styled(Grid)({
  marginTop: '12px',
});

const LogoGuidelineBox = styled(Box)({
  backgroundColor: '#f8f9fa',
  padding: '16px',
  borderRadius: '4px',
  marginTop: '24px',
  '& ul': {
    paddingLeft: '20px',
    margin: '8px 0 0 0',
  },
});

const CustomTextField = styled(TextField)({
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
  },
});

const Customize = ({ variantId, handleCustomizeSave, product, onClose }) => {
  const [shoulderLogo, setShoulderLogo] = useState(null);
  const [frontLogo, setFrontLogo] = useState(null);
  const [backLogo, setBackLogo] = useState(null);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [createCustomization] = useCreateCustomizationMutation();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState('logo');

  const { data: productData } = useGetCustomizationQuery(variantId);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLogoChange = (setter) => (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setter(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (shoulderLogo) formData.append('shoulderLogo', shoulderLogo);
    if (frontLogo) formData.append('frontLogo', frontLogo);
    if (backLogo) formData.append('backLogo', backLogo);
    formData.append('frontText', frontText);
    formData.append('backText', backText);
    formData.append('productVariantId', variantId);

    try {
      const result = await createCustomization(formData).unwrap();
      handleCustomizeSave(result);
      setSnackbar({ open: true, message: 'Customization saved successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save customization.', severity: 'error' });
    }
  };

  return (
    <CustomizationContainer sx={{marginTop:"-50px", height:"150%"}}>
    
    <ProductImageSection>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom sx={{fontSize:"20px", paddingBottom:"15px"  }}>
            Customize Uniform
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{fontSize:"15px",fontWeight: Fonts.BOLD,  }}>
            Title: {product?.title || 'SHIRT001'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{fontSize:"15px"}}>
            SKU: {product?.SKU || 'SHIRT001'}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <ImagePreview
              src={product?.variant && product.variant[0] ? `${mediaUrl}/product/${product.variant[0]?.images[0]}` : ''}
              alt={product?.title || 'Uniform'}
              sx={{ maxWidth: '90%', height: 'auto' }}
            />
          </Box>
        </Box>
      </ProductImageSection>
      
      <CustomizationSection>
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="Customization options"
        >
          <Tab 
            label="Custom Logo" 
            value="logo" 
            sx={{ 
              color: activeTab === 'logo' ? '#f36f21' : 'inherit',
            }} 
          />
          <Tab 
            label="Custom Text" 
            value="text" 
            sx={{ 
              color: activeTab === 'text' ? '#f36f21' : 'inherit',
            }} 
          />
        </StyledTabs>
        
        <TabContent>
          {activeTab === 'logo' && (
            <Box>
              <Typography variant="subtitle1" mt={1} mb={2}>Logo Positions</Typography>
              
              <LogoPositionGrid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="body1" mb={1} fontWeight="500">Front Logo</Typography>
                  <label htmlFor="front-logo-upload">
                    <Input
                      accept="image/*"
                      id="front-logo-upload"
                      type="file"
                      onChange={handleLogoChange(setFrontLogo)}
                    />
                    <LogoDropArea component="span">
                      {frontLogo ? (
                        <LogoPreviewWrapper>
                          <img 
                            src={URL.createObjectURL(frontLogo)} 
                            alt="Front Logo Preview" 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        </LogoPreviewWrapper>
                      ) : (
                        <>
                          <UploadIcon>
                            <FileUploadOutlinedIcon color="action" />
                          </UploadIcon>
                          <Typography variant="body2">Drop logo here</Typography>
                        </>
                      )}
                    </LogoDropArea>
                  </label>
                </Grid>
                

                <Grid item xs={6} > 
                  <Typography variant="body1" mb={1} fontWeight="500">Shoulder Logo</Typography>
                  <label htmlFor="shoulder-logo-upload">
                    <Input
                      accept="image/*"
                      id="shoulder-logo-upload"
                      type="file"
                      onChange={handleLogoChange(setShoulderLogo)}
                    />
                    <LogoDropArea component="span">
                      {shoulderLogo ? (
                        <LogoPreviewWrapper>
                          <img 
                            src={URL.createObjectURL(shoulderLogo)} 
                            alt="Shoulder Logo Preview" 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        </LogoPreviewWrapper>
                      ) : (
                        <>
                          <UploadIcon>
                            <FileUploadOutlinedIcon color="action" />
                          </UploadIcon>
                          <Typography variant="body2">Drop logo here</Typography>
                        </>
                      )}
                    </LogoDropArea>
                  </label>
                </Grid>
               
                <Grid item xs={12} mt={1}>
                  <Typography variant="body1" mb={1} fontWeight="500">Back Logo</Typography>
                  <label htmlFor="back-logo-upload">
                    <Input
                      accept="image/*"
                      id="back-logo-upload"
                      type="file"
                      onChange={handleLogoChange(setBackLogo)}
                    />
                    <LogoDropArea component="span">
                      {backLogo ? (
                        <LogoPreviewWrapper>
                          <img 
                            src={URL.createObjectURL(backLogo)} 
                            alt="Back Logo Preview" 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        </LogoPreviewWrapper>
                      ) : (
                        <>
                          <UploadIcon>
                            <FileUploadOutlinedIcon color="action" />
                          </UploadIcon>
                          <Typography variant="body2">Drop logo here</Typography>
                        </>
                      )}
                    </LogoDropArea>
                  </label>
                </Grid>
                
               
              </LogoPositionGrid>
              
              <LogoGuidelineBox>
                <Typography variant="subtitle1" fontWeight="bold">Logo Guidelines</Typography>
                <Typography variant="body2" component="div">
                  <ul>
                    <li>Maximum logo size: 4" x 4"</li>
                    <li>Accepted formats: .png, .jpg, .svg</li>
                    <li>Minimum resolution: 300 DPI</li>
                  </ul>
                </Typography>
              </LogoGuidelineBox>
            </Box>
          )}
          
          {activeTab === 'text' && (
            <Box mt={2}>
              <Typography variant="subtitle1" mb={3}>Custom Text</Typography>
              
              <Box mb={3}>
                <Typography variant="body1" mb={1} fontWeight="500">Front Text</Typography>
                <CustomTextField
                  variant="outlined"
                  fullWidth
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  placeholder="Enter front text"
                  size="medium"
                />
              </Box>
              
              <Box mb={3}>
                <Typography variant="body1" mb={1} fontWeight="500">Back Text</Typography>
                <CustomTextField
                  variant="outlined"
                  fullWidth
                  value={backText}
                  onChange={(e) => setBackText(e.target.value)}
                  placeholder="Enter back text"
                  size="medium"
                />
              </Box>
            </Box>
          )}
        </TabContent>
        
        <Box sx={{ position: 'sticky', bottom: 0, backgroundColor: 'white', pt: 2, mt: 2 }}>
          <SaveButton 
            variant="contained" 
            onClick={handleSubmit}
          >
            Save Customization
          </SaveButton>
        </Box>
      </CustomizationSection>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </CustomizationContainer>
  );
};

export default Customize;