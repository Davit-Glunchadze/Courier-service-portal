import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import type { FieldValues, UseFormReturn, Path } from 'react-hook-form';

// ველების ტიპი
export interface Field<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: string;
  optional?: boolean;
}

// BaseForm კომპონენტის პროპსები
interface BaseFormProps<T extends FieldValues> {
  title: string;
  fields: Field<T>[];
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children?: React.ReactNode;
  submitButtonProps?: React.ComponentProps<typeof Button>;
}

// BaseForm კომპონენტი
export const BaseForm = <T extends FieldValues>({
  title,
  fields,
  form,
  onSubmit,
  children,
}: BaseFormProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>{title}</Typography>

      {fields.map((field) => (
        <TextField
          key={field.name}
          label={field.label}
          fullWidth
          margin="normal"
          type={field.type || 'text'}
          {...register(field.name)}
          error={!!errors[field.name]}
          helperText={errors[field.name]?.message?.toString()}
        />
      ))}

      {children}

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
};
