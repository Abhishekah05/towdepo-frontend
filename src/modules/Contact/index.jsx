import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { postDataApi } from '../../@crema/hooks/APIHooks';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  useMediaQuery,
  useTheme,
  Paper
} from '@mui/material';
import { Phone, Email, LocationOn, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import contact from "../../../public/assets/contactusimage/contact.png";

const ContactPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const infoViewActionsContext = useInfoViewActionsContext();
  const [successSnackbar, setSuccessSnackbar] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      deliveryZipCode: '',
      productInterest: 'Tires',
      message: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^\d{10,}$/, 'Phone number must be at least 10 digits')
        .required('Phone number is required'),
      deliveryZipCode: Yup.string()
        .matches(/^\d{5,6}$/, 'Zip code must be 5-6 digits')
        .required('Delivery zip code is required'),
      message: Yup.string().required('Message is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await postDataApi('/contact-us', infoViewActionsContext, values);
        setSuccessSnackbar(true);
        resetForm();
      } catch (error) {
        infoViewActionsContext.fetchError(error.message);
      }
    },
  });

  const handleCloseSnackbar = () => {
    setSuccessSnackbar(false);
  };

  return (
    <Box sx={{ minHeight: '60vh', mt: -5 }}>
      {/* Header Section */}
      <Box sx={{
        textAlign: 'center',
        py: { xs: 3, md: 4 },
        backgroundColor: 'white'
      }}>
        <Typography variant="h3" sx={{
          fontWeight: 'bold',
          mb: 1,
          fontSize: { xs: '1rem', md: '2rem' }
        }}>
          Contact Us
        </Typography>
        <br />
        <Typography variant="h6" sx={{
          color: 'text.secondary',
          fontSize: { xs: '1rem', md: '1.25rem' }
        }}>
          Any question or remarks? Just write us a message!
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{
        maxWidth: '1200px',
        mx: 'auto',
        p: { xs: 2, md: 4 }
      }}>
        <Paper elevation={3} sx={{
          borderRadius: '5px',
          overflow: 'hidden',

        }}>
          <Grid container spacing={15} >
            {/* Left Side - Contact Information */}
            <Grid item xs={12} md={5}>
              <Box sx={{
                backgroundImage: `url(${contact})`,   // ✅ use imported image
                backgroundSize: 'cover',             // ✅ cover entire area
                backgroundPosition: 'center',        // ✅ keep image centered
                backgroundRepeat: 'no-repeat',
                color: 'white',
                p: { xs: 3, md: 4 },
                height: '98.5%',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '5px 0 0 5px',
                m: 2,
              }}
              >
                {/* Decorative circles */}
                <Box sx={{
                  position: 'absolute',
                  bottom: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 1
                }} />
                <Box sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  zIndex: 2
                }} />

                <Box sx={{ position: 'relative', zIndex: 3 }}>
                  <Typography variant="h4" sx={{
                    fontWeight: 'bold',
                    mt: 15,
                    ml: 15,
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}>
                    Contact Information
                  </Typography>

                  <Typography variant="body1" sx={{ mt: 25, ml: 16, fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                    Call and live chat availability hours:
                  </Typography>

                  <Typography variant="body1" sx={{
                    fontWeight: 'bold',
                    mt: 3,
                    ml: 16,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}>
                    Monday to Friday: 9:00 AM - 6:00 PM (EST)
                  </Typography>

                  {/* Contact Details */}
                  <Box sx={{ mt: 33, ml: 16, }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Phone sx={{ mr: 2, fontSize: '1rem', mt: 2 }} />

                      <Typography variant="h6" sx={{ fontWeight: 'bold',  fontSize: { xs: '0.9rem', md: '1rem' } }}>
                        929-489-8830
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 12 }}>
                      <Email sx={{ mr: 2, fontSize: '1rem', mt: 3 }} />
                      <Typography variant="body1" sx={{  fontSize: { xs: '0.9rem', md: '1rem' }, fontWeight: 'bold', }}>
                        towdepo@.com
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                      <LocationOn sx={{ mr: 2, fontSize: '1rem' , mt:5 }} />
                      <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, fontWeight: 'bold', mt: 15 }}>
                        132 Dartmouth Street Boston,<br />
                        Massachusetts 02156 United States
                      </Typography>
                    </Box>
                  </Box>

                  {/* Social Media Icons */}
                  <Box sx={{
                    display: 'flex',
                    gap: 8,
                    mt: 15,
                    ml: 16,
                    pt: 35
                  }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)'
                      }
                    }}>
                      <Twitter sx={{ fontSize: '1.2rem', }} />
                    </Box>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)'
                      }
                    }}>
                      <Instagram sx={{ fontSize: '1.2rem' }} />
                    </Box>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)'
                      }
                    }}>
                      <LinkedIn sx={{ fontSize: '1.2rem' }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Contact Form */}
            <Grid item xs={12} md={7}>
              <Box sx={{ p: { xs: 3, md: 5 } }}>
                <form onSubmit={formik.handleSubmit}>
                  {/* Name Fields */}
                  <Grid container spacing={6} sx={{ mt: 5 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{
                        mb: 1,
                        fontWeight: 'medium',
                        color: 'text.secondary'
                      }}>
                        First Name
                      </Typography>
                      <TextField
                        fullWidth
                        variant="standard"
                        name="firstName"
                        placeholder="John"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                        sx={{
                          '& .MuiInput-underline:before': {
                            borderBottomColor: '#e0e0e0'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{
                        mb: 1,
                        fontWeight: 'medium',
                        color: 'text.secondary'
                      }}>
                        Last Name
                      </Typography>
                      <TextField
                        fullWidth
                        variant="standard"
                        name="lastName"
                        placeholder="Doe"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        sx={{
                          '& .MuiInput-underline:before': {
                            borderBottomColor: '#e0e0e0'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Email and Phone */}
                  <Grid container spacing={3} sx={{ mt: 25 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{
                        mb: 1,
                        fontWeight: 'medium',
                        color: 'text.secondary'
                      }}>
                        Email
                      </Typography>
                      <TextField
                        fullWidth
                        variant="standard"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        sx={{
                          '& .MuiInput-underline:before': {
                            borderBottomColor: '#e0e0e0'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{
                        mb: 1,
                        fontWeight: 'medium',
                        color: 'text.secondary'
                      }}>
                        Phone Number
                      </Typography>
                      <TextField
                        fullWidth
                        variant="standard"
                        name="phone"
                        placeholder="+1 012 3456 789"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                        sx={{
                          '& .MuiInput-underline:before': {
                            borderBottomColor: '#e0e0e0'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Delivery Zip Code */}
                  <Box sx={{ mt: 15 }}>
                    <Typography variant="body2" sx={{
                      mb: 1,
                      fontWeight: 'medium',
                      color: 'text.secondary'
                    }}>
                      Delivery Zip code
                    </Typography>
                    <TextField
                      fullWidth
                      variant="standard"
                      name="deliveryZipCode"
                      placeholder="+1 012 3456 789"
                      value={formik.values.deliveryZipCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.deliveryZipCode && Boolean(formik.errors.deliveryZipCode)}
                      helperText={formik.touched.deliveryZipCode && formik.errors.deliveryZipCode}
                      sx={{
                        maxWidth: '300px',
                        '& .MuiInput-underline:before': {
                          borderBottomColor: '#e0e0e0'
                        }
                      }}
                    />
                  </Box>

                  {/* Product Interest Radio Buttons */}
                  <Box sx={{ mt: 25 }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{
                        color: 'text.secondary',
                        fontWeight: 'medium',
                        mb: 2
                      }}>
                        What product are you interested in?
                      </FormLabel>
                      <RadioGroup
                        row
                        name="productInterest"
                        value={formik.values.productInterest}
                        onChange={formik.handleChange}
                        sx={{ gap: 3 }}
                      >
                        <FormControlLabel
                          value="Tires"
                          control={<Radio size="small" />}
                          label="Tires"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                        />
                        <FormControlLabel
                          value="Safety jackets"
                          control={<Radio size="small" />}
                          label="Safety jackets"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                        />
                        <FormControlLabel
                          value="Safety shirts"
                          control={<Radio size="small" />}
                          label="Safety shirts"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                        />
                        <FormControlLabel
                          value="General Inquiry"
                          control={<Radio size="small" />}
                          label="General Inquiry"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  {/* Message */}
                  <Box sx={{ mt: 15 }}>
                    <Typography variant="body2" sx={{
                      mb: 1,
                      fontWeight: 'medium',
                      color: 'text.secondary'
                    }}>
                      Message
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      variant="standard"
                      name="message"
                      placeholder="Write your message.."
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.message && Boolean(formik.errors.message)}
                      helperText={formik.touched.message && formik.errors.message}
                      sx={{
                        '& .MuiInput-underline:before': {
                          borderBottomColor: '#e0e0e0'
                        }
                      }}
                    />
                  </Box>

                  {/* Submit Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 10 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={formik.isSubmitting}
                      sx={{
                        backgroundColor: '#f2630a',
                        color: 'white',
                        px: 10,
                        py: 3,
                        borderRadius: '5px',
                        textTransform: 'none',
                        fontWeight: 'medium',
                        '&:hover': {
                          backgroundColor: '#e55408'
                        }
                      }}
                    >
                      {formik.isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Box>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{
          width: "100%",
          backgroundColor: "#43a047",
          color: "white",
          fontWeight: "bold",
          "& .MuiSvgIcon-root": { color: "white" },
          padding: "2px 10px",
          minHeight: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          Sent Successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;