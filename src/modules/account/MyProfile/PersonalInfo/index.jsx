import React, { useEffect, useState } from 'react';
import { useAuthUser } from '@crema/hooks/AuthHooks';
import { Formik } from 'formik';
import * as yup from 'yup';
import PersonalInfoForm from './PersonalInfoForm';
import PropTypes from 'prop-types';
import { Box, Snackbar, Alert } from '@mui/material';
import { putDataApi, getDataApi } from '@crema/hooks/APIHooks';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';

const PersonalInfo = () => {
  const { user } = useAuthUser();
  const infoViewContext = useInfoViewActionsContext();
  const [userProfile, setUserProfile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  // Fetch User Profile Data
  const fetchUserProfile = async () => {
    try {
      if (!user || !user.userProfileId) {
        throw new Error('Invalid user profile data');
      }

      const userProfileId = user.userProfileId.id;  // Assuming userProfileId contains the ID

      // Call the API to fetch user profile data
      const response = await getDataApi(`/userprofile/${userProfileId}`, infoViewContext);

      if (response && response.Personal_Information) {
        const personalInfo = response.Personal_Information;

        setUserProfile({
          firstName: personalInfo.firstName || '',
          lastName: personalInfo.lastName || '',
          email: personalInfo.Email || '',
          phoneNumber: personalInfo.phoneNumber || '',
          bio: personalInfo.bio || '',
          dob: personalInfo.dob ? new Date(personalInfo.dob) : null,
        });
      } else {
        throw new Error('No personal information found.');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      infoViewContext.fetchError('Failed to fetch user profile.');
    }
  };


  // Save User Profile Data
  const handleSaveUserInfo = async (data, setSubmitting) => {
    try {
      const userProfileId = user?.userProfileId?.id;
      if (!userProfileId) {
        throw new Error('Invalid user profile ID');
      }

      const updatePayload = {
        Personal_Information: {
          firstName: data.firstName,
          lastName: data.lastName,
          Email: data.email,
          phoneNumber: data.phoneNumber,
          bio: data.bio,
          dob: data.dob

        },
      };

      const response = await putDataApi(`/userprofile/${userProfileId}`, infoViewContext, updatePayload);
      console.log('User info updated successfully:', response);
      infoViewContext.fetchSuccess('User info updated successfully.');
      fetchUserProfile(); // Refresh data after update
      setSnackbarOpen(true);

    } catch (error) {
      console.error('Error updating user info:', error);
      infoViewContext.fetchError('Failed to update user info.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 550,
      }}
    >
      <Formik
        validateOnBlur={true}
        initialValues={{
          firstName: userProfile?.firstName || '',
          lastName: userProfile?.lastName || '',
          email: userProfile?.email || '',
          phoneNumber: userProfile?.phoneNumber || '',
          bio: userProfile?.bio || '',  // Add bio here
          dob: userProfile?.dob || null,  // Add dob here
        }}
        validationSchema={yup.object({
          firstName: yup.string().required('First name is required'),
          lastName: yup.string().required('Last name is required'),
          email: yup.string().email('Invalid email format').required('Email is required'),
          phoneNumber: yup
            .string()
            .matches(/^[0-9+\- ]{7,15}$/, 'Invalid phone number format')
            .required('Phone number is required'),
          bio: yup.string().max(500, 'Bio cannot exceed 500 characters'),  // Optional validation for bio
          dob: yup.date().required('Date of birth is required'),  // Optional validation for dob
        })}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          handleSaveUserInfo(data, setSubmitting);
        }}
      >
        {({ values, setFieldValue, errors }) => (
          <PersonalInfoForm
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}  // Pass errors here
          />
        )}
      </Formik>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" 
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
          Changes saved successfully!
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default PersonalInfo;

PersonalInfo.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.object, // Fixed to PropTypes.object instead of PropTypes.string
};
