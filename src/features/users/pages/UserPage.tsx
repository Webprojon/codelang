import { useParams } from 'react-router-dom';
import { useUserStatistics } from '../hooks/useUserStatistics';
import UserProfile from '../components/UserProfile';
import { LoadingSpinner } from '../../../shared/components/feedback';
import { NotFound } from '../../../shared/components/layout';
import { Button } from '../../../shared/components/ui';

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : 0;

  const { userWithStats, isLoading, isError, error, refetch } = useUserStatistics(userId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !userWithStats) {
    if (isError && error) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <Button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </Button>
        </div>
      );
    }
    return <NotFound />;
  }

  return (
    <div className="min-h-screen">
      <UserProfile user={userWithStats.user} stats={userWithStats.stats} />
    </div>
  );
}
