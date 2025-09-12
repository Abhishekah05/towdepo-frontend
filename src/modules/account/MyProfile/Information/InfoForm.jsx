import React from 'react';
import AppGridContainer from '@crema/components/AppGridContainer';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IntlMessages from '@crema/helpers/IntlMessages';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { Form } from 'formik';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import PropTypes from 'prop-types';
import { DatePicker } from '@mui/x-date-pickers';
import Autocomplete from '@mui/material/Autocomplete';
import { countries } from '@crema/mockapi';

const InfoForm = ({ values, setFieldValue, isSubmitting, errors }) => {
  return (
    <Form autoComplete="off">
      <AppGridContainer spacing={4}>
        {/* <Grid item xs={12} md={12}>
          <AppTextField
            multiline
            name="bio"
            rows={3}
            fullWidth
            label={<IntlMessages id="common.yourBioDataHere" />}
            value={values.bio}
            onChange={(e) => setFieldValue('bio', e.target.value)}
            error={!!errors.bio}
            helperText={errors.bio}
          />
        </Grid> */}
        {/* <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', '& .MuiTextField-root': { width: '100%' } }}>
            <DatePicker
              label={<IntlMessages id="common.birthDate" />}
              value={values.dob}
              onChange={(newValue) => {
                setFieldValue('dob', newValue);
              }}
              renderInput={(params) => <TextField {...params} error={!!errors.dob} helperText={errors.dob} />}
            />
          </Box>
        </Grid> */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            id="country-select-demo"
            fullWidth
            options={countries}
            value={values.country} // Ensure value is bound correctly
            onChange={(_, newValue) => {
              setFieldValue('country', newValue); // Correctly update Formik state
            }}
           
            renderInput={(params) => (
              <TextField
                {...params}
                label={<IntlMessages id="common.country" />}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password',
                }}
                error={!!errors.country}
                helperText={errors.country}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            name="website"
            fullWidth
            label={<IntlMessages id="common.website" />}
            value={values.website}
            onChange={(e) => setFieldValue('website', e.target.value)}
            error={!!errors.website}
            helperText={errors.website}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField
            fullWidth
            name="phone"
            label={<IntlMessages id="common.phoneNumber" />}
            value={values.phone}
            onChange={(e) => setFieldValue('phone', e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              sx={{ position: 'relative', minWidth: 100 }}
              color="primary"
              variant="contained"
              type="submit"
              disabled={isSubmitting} // Disable button while submitting
            >
              <IntlMessages id="common.saveChanges" />
            </Button>

            <Button sx={{ position: 'relative', minWidth: 100, ml: 2.5 }} color="primary" variant="outlined" type="reset">
              <IntlMessages id="common.cancel" />
            </Button>
          </Box>
        </Grid>
      </AppGridContainer>
    </Form>
  );
};

InfoForm.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.object,
  isSubmitting: PropTypes.bool,
  errors: PropTypes.object,
};

export default InfoForm;
