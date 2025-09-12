import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import AppGridContainer from '@crema/components/AppGridContainer';
import IntlMessages from '@crema/helpers/IntlMessages';
import { Fonts } from '@crema/constants/AppEnums';
import PropTypes from 'prop-types';

const ManageAddressForm = ({ values, handleChange }) => {

  return (
    <form noValidate autoComplete='off'>
      <Typography
        component='h3'
        sx={{
          fontSize: 16,
          fontWeight: Fonts.BOLD,
          mb: { xs: 3, lg: 4 },
        }}
      >
        <IntlMessages id='common.manageAddress' />
      </Typography>

      <Typography
        component='h4'
        sx={{
          fontSize: 14,
          fontWeight: Fonts.MEDIUM,
          mb: 2,
        }}
      >
        <IntlMessages id='common.currentAddress' />
      </Typography>

      <AppGridContainer spacing={4}>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='currentDoorNumber'
            fullWidth
            label={<IntlMessages id='common.doorNumber' />}
            value={values.currentDoorNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='currentStreetName'
            fullWidth
            label={<IntlMessages id='common.streetName' />}
            value={values.currentStreetName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='currentState'
            fullWidth
            label={<IntlMessages id='common.state' />}
            value={values.currentState}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='currentPinCode'
            fullWidth
            label={<IntlMessages id='common.pinCode' />}
            value={values.currentPinCode}
            onChange={handleChange}
          />
        </Grid>
      </AppGridContainer>

      <Typography
        component='h4'
        sx={{
          fontSize: 14,
          fontWeight: Fonts.MEDIUM,
          mt: 4,
          mb: 2,
        }}
      >
        <IntlMessages id='common.permanentAddress' />
      </Typography>

      <AppGridContainer spacing={4}>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='permanentDoorNumber'
            fullWidth
            label={<IntlMessages id='common.doorNumber' />}
            value={values.permanentDoorNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='permanentStreetName'
            fullWidth
            label={<IntlMessages id='common.streetName' />}
            value={values.permanentStreetName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='permanentState'
            fullWidth
            label={<IntlMessages id='common.state' />}
            value={values.permanentState}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            name='permanentPinCode'
            fullWidth
            label={<IntlMessages id='common.pinCode' />}
            value={values.permanentPinCode}
            onChange={handleChange}
          />
        </Grid>
      </AppGridContainer>

      {/* <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 4,
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
      </Box> */}
    </form>
  );
};

ManageAddressForm.propTypes = {
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ManageAddressForm;
