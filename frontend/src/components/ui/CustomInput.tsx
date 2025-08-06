import React from 'react';
import { TextField, type TextFieldProps, Box } from '@mui/material';

export type CustomInputProps = TextFieldProps & {
  label: string | number;
  width?: string | number;
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  width = '100%',
  sx,
  margin = 'normal',
  fullWidth = true,
  ...props
}) => {
  return (
    <TextField
      label={label}
      fullWidth={fullWidth}
      variant="outlined"
      margin={margin}
      sx={{ width, ...sx }}
      {...props}
    />
  );
};

export default CustomInput;
