import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import * as yup from 'yup';
import { Fonts } from '@crema/constants/AppEnums';
import IntlMessages from '@crema/helpers/IntlMessages';
import InfoForm from './InfoForm';
import { Formik } from 'formik';
import { useInfoViewActionsContext } from '../../../../@crema/context/AppContextProvider/InfoViewContextProvider'
import { getDataApi, putDataApi } from '../../../../@crema/hooks/APIHooks';
import { useAuthUser } from '@crema/hooks/AuthHooks';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const phoneRegExp = /^[+]?[0-9\s-]+$/;

// Validation schema for the form
// Updated validation schema
const validationSchema = yup.object({
  phone: yup
    .string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .nullable(),
  bio: yup.string(),
  dob: yup.date().required('Date of birth is required'),
  country: yup
    .object()
    .shape({
      label: yup.string().required('Country is required'),
      code: yup.string().required('Country code is required'),
    })
    .required('Country is required'),
  website: yup.string().url('Invalid website URL'),
});

const Information = () => {
  const [userData, setUserData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [fetchSuccess, setFetchSuccess] = useState(null);
  const { user } = useAuthUser();
  const infoViewActionsContext = useInfoViewActionsContext();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user?.userProfileId?.id) {
          setFetchError('User ID is missing.');
          return;
        }

        const response = await getDataApi(`/userprofile/${user?.userProfileId?.id}`, infoViewActionsContext);

        if (response?.Information) {
          const { Information } = response;
          setUserData({
            bio: Information?.bio || '',
            dob: Information?.dob || '',
            country: Information?.country?.name || 'United States',
            website: Information?.website || '',
            phone: Information?.phone || '',
          });
        } else {
          setFetchError('Failed to fetch user information.');
        }
      } catch (error) {
        setFetchError('Failed to fetch user information.');
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateUserData = async (data, setSubmitting) => {
    try {
      const userProfileId = user?.userProfileId?.id;
      if (!userProfileId) {
        throw new Error('User profile ID is missing.');
      }

      const updatePayload = {
        Information: {
          bio: data.bio || '',
          dob: data.dob ? data.dob.toISOString() : '',
          country: {
            name: data.country?.name || 'United States',
            code: data.country?.code || 'US',
          },
          website: data.website || '',
          phone: data.phone || '',
        },
      };

      console.log('Updating with payload:', updatePayload);

      const response = await putDataApi(
        `/userprofile/${userProfileId}`,
        updatePayload,
        infoViewActionsContext
      );

      console.log('Response from API:', response);

      if (response?.success) {
        setFetchSuccess('User information updated successfully.');
        setUserData(); // Refresh user data after update
      } else {
        throw new Error('Failed to update user information.');
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      setFetchError('Failed to update user information: ' + error.message);
    } finally {
      setSubmitting(false); // Ensure submitting state is set to false
    }
  };

  if (fetchError) {
    return <Typography color="error">{fetchError}</Typography>;
  }

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ position: 'relative', maxWidth: 550 }}>
      <Typography component="h3" sx={{ fontSize: 16, fontWeight: Fonts.BOLD, mb: { xs: 3, lg: 5 } }}>
        <IntlMessages id="common.information" />
      </Typography>
      <Formik
        initialValues={{
          bio: userData?.bio || '',
          dob: dayjs(userData?.dob || ''),
          country: userData?.country || '',
          website: userData?.website || '',
          phone: userData?.phone || '',
        }}
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting, setErrors }) => {
          setSubmitting(true);
          handleUpdateUserData(data, setSubmitting);
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors }) => (
          <InfoForm
            values={values}
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
            errors={errors} // Add this for debugging errors
          />
        )}
      </Formik>
    </Box>
  );
};

export default Information;
