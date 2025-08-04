import React from 'react';
import { TextField, type TextFieldProps, Box } from '@mui/material';

export type CustomInputProps = TextFieldProps & {
  label: string |number;
  width?: string | number; // e.g., '300px', 250, etc.
};

const CustomInput: React.FC<CustomInputProps> = ({ label, width = '100%', sx, ...props }) => {
  return (
    <Box sx={{ width, marginBottom: 2 }}>
      <TextField
        label={label}
        variant="outlined"
        fullWidth
        {...props}
        sx={sx}
      />
    </Box>
  );
};

export default CustomInput;
