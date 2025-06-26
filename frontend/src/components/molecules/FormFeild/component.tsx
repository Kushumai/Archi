import React from 'react';
import Input from '@/components/atoms/Input/component';
import { FormFieldProps } from './types';

const FormField: React.FC<FormFieldProps> = ({ label, id, ...inputProps }) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <Input id={id} {...inputProps} />
  </div>
);

export default FormField;
