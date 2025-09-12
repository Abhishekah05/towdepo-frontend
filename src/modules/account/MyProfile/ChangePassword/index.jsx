import React, { useEffect, useState } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import IntlMessages from '@crema/helpers/IntlMessages';
import { Fonts } from '@crema/constants/AppEnums';
import ChangePasswordForm from './ChangePasswordForm';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { putDataApi } from '../../../../@crema/hooks/APIHooks';
import { useAuthUser } from '@crema/hooks/AuthHooks';


const validationSchema = yup.object({
  oldPassword: yup
    .string()
    .required('No password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  newPassword: yup
    .string()
    .required('New password required.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  retypeNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});


const ChangePassword = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const infoViewContext = useInfoViewActionsContext();
  const { user } = useAuthUser();
  const userID = user?.id;
  const userProfile = user?.userProfileId.id;
  console.log("data", user);

  const handleChangePassword = async (data, setSubmitting) => {
    try {
      const response = await putDataApi(
        `/userprofile/${userProfile}`, // Replace with your API endpoint
        infoViewContext,

        {
          Changepassword: {
            password: data.oldPassword,
            confirmPassword: data.newPassword,
          }
        }
      );
      console.log('Password change successful: ', response);
      infoViewContext.fetchSuccess('Password updated successfully.');
      setSnackbarOpen(true);
    
    } catch (error) {
      console.error('Error updating password: ', error);
      infoViewContext.fetchError('Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 550,
      }}
    >
      <Typography
        component="h3"
        sx={{
          fontSize: 16,
          fontWeight: Fonts.BOLD,
          mb: { xs: 3, lg: 5 },
        }}
      >
        <IntlMessages id="common.changePassword" />
      </Typography>
      <Formik
        validateOnChange={false}
        validateOnBlur={true}
        initialValues={{
          oldPassword: '',
          newPassword: '',
          retypeNewPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          handleChangePassword(data, setSubmitting);
        }}
      >
        {() => <ChangePasswordForm />}
      </Formik>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{
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
        }}>
          Changes saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChangePassword;
