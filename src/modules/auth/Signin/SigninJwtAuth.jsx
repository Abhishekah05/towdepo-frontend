import React from 'react';
import Button from '@mui/material/Button';
import { Checkbox } from '@mui/material';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

import AppInfoView from '@crema/components/AppInfoView';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IntlMessages from '@crema/helpers/IntlMessages';
import { useIntl } from 'react-intl';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import { useAuthMethod } from '@crema/hooks/AuthHooks';
import { Fonts } from '@crema/constants/AppEnums';
import AuthWrapper from '../AuthWrapper';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

const validationSchema = yup.object({
  email: yup
    .string()
    .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.emailRequired' />),
  password: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
});

const SigninJwtAuth = () => {
  const navigate = useNavigate();
  const { signInUser } = useAuthMethod();
  const onGoToForgetPassword = () => {
    navigate('/forget-password', { tab: 'jwtAuth' });
  };

  const { messages } = useIntl();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthWrapper>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 1 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Formik
            validateOnChange={true}
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting }) => {
              setSubmitting(true);
              signInUser({
                email: data.email,
                password: data.password,
              });
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>
                <Box
                  sx={{
                    mb: { xs: 4, xl: 6 },
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <AppTextField
                    placeholder={messages['common.email']}
                    name='email'
                    label={<IntlMessages id='common.email' />}
                    variant='outlined'
                    sx={{
                      width: { xs: '100%', sm: '80%' },
                      '& .MuiInputBase-input': {
                        fontSize: 14,
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    mb: { xs: 3, xl: 4 },
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <AppTextField
                    type={showPassword ? 'text' : 'password'}
                    placeholder={messages['common.password']}
                    label={<IntlMessages id='common.password' />}
                    name='password'
                    variant='outlined'
                    sx={{
                      width: { xs: '100%', sm: '80%' },
                      '& .MuiInputBase-input': {
                        fontSize: 14,
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge='end'
                            aria-label='toggle password visibility'
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    mb: { xs: 3, xl: 4 },
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: '100%', sm: '80%' },
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {/* Left side → Remember Me */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox 
                        color='primary' 
                        sx={{ 
                          ml: { xs: -1.5, sm: -6 },
                          p: { xs: 1, sm: 1.5 }
                        }} 
                      />
                      <Box component='span' sx={{ color: 'grey.700', fontSize: 14 }}>
                        <IntlMessages id='common.rememberMe' />
                      </Box>
                    </Box>

                    {/* Right side → Forget Password */}
                    <Box
                      component='span'
                      sx={{
                        color: (theme) => theme.palette.primary.main,
                        fontWeight: Fonts.MEDIUM,
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                      onClick={onGoToForgetPassword}
                    >
                      <IntlMessages id='common.forgetPassword' />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={isSubmitting}
                    sx={{
                      width: { xs: '100%', sm: '85%' },
                      fontWeight: Fonts.REGULAR,
                      fontSize: 16,
                      mt: { xs: 4, sm: 10 },
                      textTransform: 'capitalize',
                      padding: '8px 16px',
                    }}
                  >
                    <IntlMessages id='common.login' />
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>

        <Box
          sx={{
            color: 'grey.700',
            mt: { xs: 6, sm: 10 },
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            textAlign: 'center',
          }}
        >
          <span style={{ marginRight: 4 }}>
            <IntlMessages id='common.dontHaveAccount' />
          </span>
          <Box
            component='span'
            sx={{
              fontWeight: Fonts.MEDIUM,
              '& a': {
                color: (theme) => theme.palette.primary.main,
                textDecoration: 'none',
              },
            }}
          >
            <Link to='/signup'>
              <IntlMessages id='common.signup' />
            </Link>
          </Box>
        </Box>

        <AppInfoView />
      </Box>
    </AuthWrapper>
  );
};

export default SigninJwtAuth;