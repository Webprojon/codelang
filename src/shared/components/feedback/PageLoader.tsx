import { LoadingSpinner } from '@shared/components/feedback';

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}
