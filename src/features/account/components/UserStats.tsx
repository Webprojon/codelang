import type { UserStats as UserStatsType } from '@features/account/types';

interface UserStatsProps {
  stats: UserStatsType;
}

export default function UserStats({ stats }: UserStatsProps) {
  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className="mt-6 ml-0 sm:ml-4">
      <dl className="space-y-1 text-xs sm:text-sm font-medium text-gray-900 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-1">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="flex">
            <dt className="mr-2 font-bold leading-[12px]">{formatLabel(key)}:</dt>
            <dd className="leading-[12px]">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
