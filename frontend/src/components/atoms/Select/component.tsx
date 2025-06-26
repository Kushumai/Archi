import React from 'react';
import { SelectProps } from './types';

const Select: React.FC<SelectProps> = ({ options, className, ...props }) => (
  <select
    {...props}
    className={`border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring ${className}`}
  >
    {options.map(({ value, label }) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </select>
);

export default Select;