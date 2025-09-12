import React from 'react';
import { alpha, Box, Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AppGridContainer from '@crema/components/AppGridContainer';
import Grid from '@mui/material/Grid';
import IntlMessages from '@crema/helpers/IntlMessages';
import { useDropzone } from 'react-dropzone';
import { Form } from 'formik';
import PropTypes from 'prop-types';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import { Fonts } from '@crema/constants/AppEnums';
import dayjs from 'dayjs';  // Import dayjs
import { DatePicker } from '@mui/x-date-pickers';

const AvatarViewWrapper = styled('div')(({ theme }) => {
  return {
    position: 'relative',
    cursor: 'pointer',
    '& .edit-icon': {
      position: 'absolute',
      bottom: 0,
      right: 0,
      zIndex: 1,
      border: `solid 2px ${theme.palette.background.paper}`,
      backgroundColor: alpha(theme.palette.primary.main, 0.7),
      color: theme.palette.primary.contrastText,
      borderRadius: '50%',
      width: 26,
      height: 26,
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.4s ease',
      cursor: 'pointer',
      '& .MuiSvgIcon-root': {
        fontSize: 16,
      },
    },
    '&.dropzone': {
      outline: 0,
      '&:hover .edit-icon, &:focus .edit-icon': {
        display: 'flex',
      },
    },
  };
});

const PersonalInfoForm = ({ values, setFieldValue, errors }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFieldValue('photoURL', URL.createObjectURL(acceptedFiles[0]));
    },
  });

  return (
    <Form noValidate autoComplete='off'>
      <Typography
        component='h3'
        sx={{
          fontSize: 16,
          fontWeight: Fonts.BOLD,
          mb: { xs: 3, lg: 4 },
        }}
      >
        <IntlMessages id='common.personalInfo' />
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: { xs: 5, lg: 6 },
        }}
      >
        <AvatarViewWrapper {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <label htmlFor='icon-button-file'>
            <Avatar
              sx={{
                width: { xs: 50, lg: 64 },
                height: { xs: 50, lg: 64 },
                cursor: 'pointer',
              }}
              src={values.photoURL}
            />
            <Box className='edit-icon'>
              <EditIcon />
            </Box>
          </label>
        </AvatarViewWrapper>
        <Box
          sx={{
            ml: 4,
          }}
        >
          <Typography
            sx={{
              fontWeight: Fonts.MEDIUM,
            }}
          >
            {values.firstName} {values.lastName}
          </Typography>
          <Typography
            sx={{
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            {values.email}
          </Typography>
        </Box>
      </Box>
      <AppGridContainer spacing={4}>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='firstName'
            fullWidth
            label={<IntlMessages id='common.firstName' />}
            error={!!errors.firstName} // Display error for firstName
            helperText={errors.firstName} // Show helper text for firstName error
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='lastName'
            fullWidth
            label={<IntlMessages id='common.lastName' />}
            error={!!errors.lastName} // Display error for lastName
            helperText={errors.lastName} // Show helper text for lastName error
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='email'
            fullWidth
            label={<IntlMessages id='common.email' />}
            error={!!errors.email} // Display error for email
            helperText={errors.email} // Show helper text for email error
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='phoneNumber'
            fullWidth
            label={<IntlMessages id='common.mobileNumber' />}
            error={!!errors.phoneNumber} // Display error for phoneNumber
            helperText={errors.phoneNumber} // Show helper text for phoneNumber error
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', '& .MuiTextField-root': { width: '100%' } }}>
            <DatePicker
              label={<IntlMessages id="common.birthDate" />}
              value={values.dob ? dayjs(values.dob) : null} // Ensure this is a Dayjs object
              onChange={(newValue) => {
                setFieldValue('dob', newValue);
              }}
              renderInput={(params) => (
                <AppTextField
                  {...params}
                  error={!!errors.dob}  // Display error for dob
                  helperText={errors.dob}  // Show helper text for dob error
                />
              )}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={12}>
          <AppTextField
            multiline
            name="bio"
            rows={3}
            fullWidth
            label={<IntlMessages id="common.yourBioDataHere" />}
            value={values.bio}
            onChange={(e) => setFieldValue('bio', e.target.value)}
            error={!!errors.bio}  // Display error for bio
            helperText={errors.bio}  // Show helper text for bio error
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              sx={{
                position: 'relative',
                minWidth: 100,
              }}
              color='primary'
              variant='contained'
              type='submit'
            >
              <IntlMessages id='common.saveChanges' />
            </Button>
            <Button
              sx={{
                position: 'relative',
                minWidth: 100,
                ml: 2.5,
              }}
              color='primary'
              variant='outlined'
              type='reset'
            >
              <IntlMessages id='common.cancel' />
            </Button>
          </Box>
        </Grid>
      </AppGridContainer>
    </Form>
  );
};

PersonalInfoForm.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.object,
  errors: PropTypes.object.isRequired, // Ensure errors is passed and required
};

export default PersonalInfoForm;
