import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { IoChevronDown } from 'react-icons/io5';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  id: string;
  error?: string;
  containerClassName?: string;
  selectClassName?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, error, containerClassName = '', selectClassName = '', options, value, ...rest }, ref) => {
    return (
      <div className={`relative ${containerClassName}`}>
        <div className="relative">
          <select
            ref={ref}
            id={id}
            value={value ?? ''}
            className={`w-full text-sm bg-gray-100 border-b py-3 px-4 rounded-t-sm outline-none transition-all appearance-none cursor-pointer
              ${error ? 'border-b-red-500' : 'border-b-gray-300 focus:border-b-brand-500'} ${selectClassName}`}
            {...rest}
          >
            {options.map(option => (
              <option key={option.value} value={option.value} className="bg-gray-100">
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <IoChevronDown />
          </div>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
