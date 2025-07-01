import React from 'react';
import Label from './label';

interface FormInputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder: string;
  required?: boolean;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  label,
  placeholder,
  required = false,
  className = '',
}) => {
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 border-none border-border-subtle rounded-lg bg-background-base text-text-primary placeholder-text-tertiary text-xs md:text-base placeholder:text-xs md:placeholder:text-base focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-colors"
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormInput;
