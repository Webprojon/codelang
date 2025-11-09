import { Link } from 'react-router-dom';
import Button from '@shared/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex-center bg-gray-200 p-4">
      <div className="flex-col flex-center">
        <h1 className="text-9xl font-bold text-gray-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="w-full sm:w-auto" color="secondary" size="md">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
