import { LoadingSpinner } from '@shared/components/feedback';

interface LoadingContainerProps {
  className?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
}

export default function LoadingContainer({
  className = '',
  spinnerSize = 'lg',
}: LoadingContainerProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <LoadingSpinner size={spinnerSize} />
    </div>
  );
}
