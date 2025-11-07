import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  icon?: ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ icon, className = '', children, type = 'button', ...rest }, ref) => {
    const baseClasses =
      'cursor-pointer rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseClasses} ${className} ${icon ? 'flex items-center' : ''}`}
        {...rest}
      >
        {icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
