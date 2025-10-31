import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'white' | 'white-uppercase' | 'icon';
  icon?: ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'white',
      icon,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const getVariantClass = () => {
      const baseClasses =
        'cursor-pointer px-4 py-2 rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500';

      switch (variant) {
        case 'white':
          return `${baseClasses} bg-white text-gray-600 hover:bg-[#3974ce]`;
        case 'white-uppercase':
          return `${baseClasses} bg-white text-gray-600 hover:bg-gray-200 uppercase`;
        case 'icon':
          return 'gap-1 cursor-pointer shrink-0 flex items-center';
        default:
          return `${baseClasses} bg-white text-gray-600 hover:bg-gray-200`;
      }
    };

    return (
      <button
        ref={ref}
        type={type}
        className={`${getVariantClass()} ${className}`}
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
