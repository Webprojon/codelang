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
      <div className={containerClassName}>
        <label
          htmlFor={id}
          className={`block text-base text-black mb-1 font-sans ${labelClassName}`}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          className={`w-full text-base text-black bg-transparent border-0 border-b border-gray-300 py-2 outline-none font-sans ${
            error ? 'border-red-500' : ''
          } ${inputClassName}`}
          {...rest}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500 font-sans">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
