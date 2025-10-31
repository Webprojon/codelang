import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  id: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      type = 'text',
      error,
      containerClassName = '',
      inputClassName = '',
      labelClassName = '',
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`font-sans ${containerClassName}`}>
        <label
          htmlFor={id}
          className={`block text-base mb-1 font-medium ${labelClassName}`}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          className={`w-full text-sm bg-transparent border-b py-2 px-0 outline-none transition-colors 
            ${error ? 'border-red-500' : 'border-gray-300'} ${inputClassName}`}
          {...rest}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
