import React, { useEffect, useState } from 'react';
import { useAuthUser } from '@crema/hooks/AuthHooks';
import { Formik } from 'formik';
import * as yup from 'yup';
import ManageAddressForm from './ManageAddress';
import IntlMessages from '@crema/helpers/IntlMessages';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import { putDataApi, getDataApi } from '@crema/hooks/APIHooks';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';

const ManageAddress = () => {
  const { user } = useAuthUser();
  const infoViewActionsContext = useInfoViewActionsContext();
  const [userAddress, setUserAddress] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success, error, warning, info

  // Fetch User Address Data
  const fetchUserAddress = async () => {
    try {
      const userProfileId = user?.userProfileId?.id;
      if (!userProfileId) {
        infoViewActionsContext.fetchError('User profile ID is missing.');
        return;
      }

      const response = await getDataApi(`/userprofile/${userProfileId}`, infoViewActionsContext);
      const addressData = response?.ManageAddress;

      if (addressData) {
        setUserAddress({
          currentDoorNumber: addressData.doorNumber || '',
          currentStreetName: addressData.streetName || '',
          currentState: addressData.state || '',
          currentPinCode: addressData.pinCode || '',
          permanentDoorNumber: addressData.permanentDoorNumber || '',
          permanentStreetName: addressData.permanentStreetName || '',
          permanentState: addressData.permanentState || '',
          permanentPinCode: addressData.permanentPinCode || '',
        });
      } else {
        console.error('Address data not found in response.');
      }
    } catch (error) {
      console.error('Error fetching user address:', error);
      infoViewActionsContext.fetchError('Failed to fetch user address.');
    }
  };

  // Save User Address Data
  const handleSaveAddress = async (data, setSubmitting) => {
    try {
      const userProfileId = user?.userProfileId?.id;
      if (!userProfileId) {
        infoViewActionsContext.fetchError('User profile ID is missing.');
        return;
      }

      const updatePayload = {
        ManageAddress: {
          doorNumber: data.currentDoorNumber,
          streetName: data.currentStreetName,
          state: data.currentState,
          pinCode: data.currentPinCode,
          permanentDoorNumber: data.permanentDoorNumber,
          permanentStreetName: data.permanentStreetName,
          permanentState: data.permanentState,
          permanentPinCode: data.permanentPinCode,
        },
      };

      const response = await putDataApi(`/userprofile/${userProfileId}`, infoViewActionsContext, updatePayload);
      
     
        console.log('Changes saved successfully');
        infoViewActionsContext.fetchSuccess('Changes saved successfully');
        setSnackbarMessage(' Changes Saved successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchUserAddress();
     
        
      
    } catch (error) {
      console.error('Error updating address:', error);
      setSnackbarMessage('Failed to update address.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      infoViewActionsContext.fetchError('Failed to update address.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user?.userProfileId?.id) {
      fetchUserAddress();
    }
  }, [user?.userProfileId?.id]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (userAddress === null) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ position: 'relative', maxWidth: 550 }}>
      <Formik
        initialValues={userAddress}
        validationSchema={yup.object({
          currentDoorNumber: yup.string().required('Required'),
          currentStreetName: yup.string().required('Required'),
          currentState: yup.string().required('Required'),
          currentPinCode: yup.string().required('Required').matches(/^[0-9]{6}$/, 'Invalid Pin Code'),
          permanentDoorNumber: yup.string().required('Required'),
          permanentStreetName: yup.string().required('Required'),
          permanentState: yup.string().required('Required'),
          permanentPinCode: yup.string().required('Required').matches(/^[0-9]{6}$/, 'Invalid Pin Code'),
        })}
        onSubmit={async (data, { setSubmitting }) => {
          setSubmitting(true);
          await handleSaveAddress(data, setSubmitting);
        }}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <ManageAddressForm values={values} handleChange={handleChange} />
            <Box sx={{ mt: 4 }}>
              <Button sx={{ minWidth: 100 }} color="primary" variant="contained" type="submit" disabled={isSubmitting}>
                <IntlMessages id='common.saveChanges' />
              </Button>
              <Button sx={{ minWidth: 100, ml: 2.5 }} color="primary" variant="outlined" type="reset">
                <IntlMessages id='common.cancel' />
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Snackbar Component */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}    
        sx={{
          width: "100%",
          backgroundColor: "#43a047", // Custom background color
          color: "white",
          fontWeight: "bold",
          "& .MuiSvgIcon-root": { color: "white" },
          padding: "2px 10px", // Reduce padding to decrease height
          minHeight: "28px", // Set a minimum height
          display: "flex",
          alignItems: "center", // Align text and icons vertically
          justifyContent: "center", // Center content horizontally
        }}
        >
          {snackbarMessage}
        </Alert >
      </Snackbar>
    </Box>
  );
};

export default ManageAddress;