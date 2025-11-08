import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'ghost'
  | 'light';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  icon?: ReactNode;
  className?: string;
  size?: ButtonSize;
  color?: ButtonColor;
  fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-0 py-0',
  md: 'px-4 py-2',
  lg: 'px-6 py-3',
};

const colorClasses: Record<ButtonColor, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand2-500',
  secondary: 'bg-gray-500 text-gray-300 hover:bg-gray-400',
  success: 'bg-[#4CAF50] text-white hover:bg-[#4CAF50]/90',
  warning: 'bg-orange-500 text-white hover:bg-orange-600',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-gray-500',
  light: 'bg-white text-gray-600 hover:bg-gray-100',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { icon, className = '', children, type = 'button', size = 'md', color, fullWidth, ...rest },
    ref
  ) => {
    const baseClasses =
      'cursor-pointer rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

    const paddingClass = sizeClasses[size];
    const colorClass = color ? colorClasses[color] : '';
    const flexClass = icon ? 'flex items-center gap-2' : '';
    const widthClass = fullWidth ? 'w-full' : '';

    const combinedClassName = [
      baseClasses,
      paddingClass,
      colorClass,
      flexClass,
      widthClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} type={type} className={combinedClassName} {...rest}>
        {icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
