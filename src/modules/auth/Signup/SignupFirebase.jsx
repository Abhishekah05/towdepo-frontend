import React from 'react';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import IntlMessages from '@crema/helpers/IntlMessages';
import { useAuthMethod } from '@crema/hooks/AuthHooks';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AppInfoView from '@crema/components/AppInfoView';
import { Fonts } from '@crema/constants/AppEnums';
import { Link } from 'react-router-dom';
import { AiOutlineGoogle, AiOutlineTwitter } from 'react-icons/ai';
import { BsGithub } from 'react-icons/bs';
import { FaFacebookF } from 'react-icons/fa';
import AuthWrapper from '../AuthWrapper';

const validationSchema = yup.object({
  name: yup.string().required(<IntlMessages id='validation.nameRequired' />),
  email: yup
    .string()
    .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.emailRequired' />),
  password: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
});

const SignupFirebase = () => {
  const { registerUserWithEmailAndPassword, logInWithPopup } = useAuthMethod();

  return (
    <AuthWrapper>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 5 }}>
          <Formik
            validateOnChange={true}
            initialValues={{
              name: '',
              email: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting }) => {
              setSubmitting(true);
              console.log('data', data);
              registerUserWithEmailAndPassword(data);
              console.log(
                'registerUserWithEmailAndPassword',
                registerUserWithEmailAndPassword,
              );
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>
                <Box sx={{ 
                  mb: { xs: 3, xl: 4 },
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <AppTextField
                    label={<IntlMessages id='common.name' />}
                    name='name'
                    variant='outlined'
                    sx={{
                      width: { xs: '100%', sm: '80%' },
                      '& .MuiInputBase-input': {
                        fontSize: 14,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ 
                  mb: { xs: 3, xl: 4 }, 
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <AppTextField
                    label={<IntlMessages id='common.email' />}
                    name='email'
                    variant='outlined'
                    sx={{
                      width: { xs: '100%', sm: '80%' },
                      '& .MuiInputBase-input': {
                        fontSize: 14,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ 
                  mb: { xs: 3, xl: 4 },
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <AppTextField
                    label={<IntlMessages id='common.password' />}
                    name='password'
                    type='password'
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
                  <Box
                    sx={{
                      width: { xs: '100%', sm: '80%' },
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Checkbox
                        sx={{
                          ml: { xs: -1.5, sm: 0 },
                          p: { xs: 1, sm: 1.5 }
                        }}
                      />
                      <Box
                        component='span'
                        sx={{
                          mr: 2,
                          color: 'grey.700',
                          ml: { xs: 0, sm: 2 }
                        }}
                      >
                        <IntlMessages id='common.iAgreeTo' />
                      </Box>
                    </Box>
                    <Box
                      component='span'
                      sx={{
                        color: (theme) => theme.palette.primary.main,
                        cursor: 'pointer',
                      }}
                    >
                      <IntlMessages id='common.termConditions' />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={isSubmitting}
                    sx={{
                      width: { xs: '100%', sm: '80%' },
                      fontWeight: Fonts.REGULAR,
                      fontSize: 16,
                      textTransform: 'capitalize',
                      padding: '8px 16px',
                    }}
                    type='submit'
                  >
                    <IntlMessages id='common.signup' />
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>

        <Box
          sx={{
            color: 'grey.700',
            mb: { xs: 4, md: 6 },
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            textAlign: 'center',
          }}
        >
          <span style={{ marginRight: 4 }}>
            <IntlMessages id='common.alreadyHaveAccount' />
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
            <Link to='/signIn'>
              <IntlMessages id='common.signIn' />
            </Link>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: (theme) => theme.palette.background.default,
            mx: { xs: 0, lg: 6 },
            mb: { xs: 2, lg: 4 },
            mt: 'auto',
            py: 2,
            px: { xs: 3, lg: 6 },
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              color: (theme) => theme.palette.text.secondary,
              fontSize: { xs: 12, sm: 14 },
            }}
          >
            <IntlMessages id='common.orLoginWith' />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconButton
              sx={{ p: { xs: 1, sm: 2 }, '& svg': { fontSize: 18 } }}
              onClick={() => logInWithPopup('google')}
            >
              <AiOutlineGoogle />
            </IconButton>
            <IconButton
              sx={{
                p: { xs: 1, sm: 1.5 },
                '& svg': { fontSize: 18 },
              }}
              onClick={() => logInWithPopup('facebook')}
            >
              <FaFacebookF />
            </IconButton>
            <IconButton
              sx={{
                p: { xs: 1, sm: 1.5 },
                '& svg': { fontSize: 18 },
              }}
              onClick={() => logInWithPopup('github')}
            >
              <BsGithub />
            </IconButton>
            <IconButton
              sx={{
                p: { xs: 1, sm: 1.5 },
                '& svg': { fontSize: 18 },
              }}
              onClick={() => logInWithPopup('twitter')}
            >
              <AiOutlineTwitter />
            </IconButton>
          </Box>
        </Box>

        <AppInfoView />
      </Box>
    </AuthWrapper>
  );
};

export default SignupFirebase;