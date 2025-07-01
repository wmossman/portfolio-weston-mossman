import React from 'react';
import Label from './label';

interface FormTextareaProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  placeholder: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  rows = 6,
  className = '',
}) => {
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 border-none border-border-subtle rounded-lg bg-background-base text-text-primary placeholder-text-tertiary text-xs md:text-base placeholder:text-xs md:placeholder:text-base focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-colors resize-vertical"
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormTextarea;
