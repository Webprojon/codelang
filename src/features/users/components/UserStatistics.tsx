import type { UserStats } from '../../account/types';

interface UserStatisticsProps {
  stats: UserStats;
}

export default function UserStatistics({ stats }: UserStatisticsProps) {
  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const statsEntries = Object.entries(stats);

  return (
    <div className="max-w-xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
      <dl className="font-medium text-gray-900">
        {statsEntries.map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0"
          >
            <dt className="font-semibold text-gray-700">{formatLabel(key)}:</dt>
            <dd className="text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
