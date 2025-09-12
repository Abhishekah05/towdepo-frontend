import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export const OutlinedSecondaryTextField = () => (
  <TextField label='Outlined secondary' color='secondary' focused />
);

export const FilledSuccessTextField = () => (
  <TextField label='Filled success' variant='filled' color='success' focused />
);

export const StandardWarningTextField = () => (
  <TextField label='Standard warning' variant='standard' color='warning' focused />
);

export default function ColorTextFields() {
  return (
    <Box
      component='form'
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete='off'
    >
      <OutlinedSecondaryTextField />
      <FilledSuccessTextField />
      <StandardWarningTextField />
    </Box>
  );
}
