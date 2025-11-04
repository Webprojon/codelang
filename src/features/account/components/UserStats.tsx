import type { UserStats as UserStatsType } from '../types';

interface UserStatsProps {
  stats: UserStatsType;
}

export default function UserStats({ stats }: UserStatsProps) {
  const statsItems = [
    { label: 'Rating', value: stats.rating },
    { label: 'Snippets', value: stats.snippets },
    { label: 'Comments', value: stats.comments },
    { label: 'Likes', value: stats.likes },
    { label: 'Dislikes', value: stats.dislikes },
    { label: 'Questions', value: stats.questions },
    { label: 'Correct Answers', value: stats.correctAnswers },
    { label: 'Regular Answers', value: stats.regularAnswers },
  ];

  return (
    <div className="mt-6 ml-0 sm:ml-4">
      <dl className="space-y-1 text-xs sm:text-sm font-medium text-gray-900 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-1">
        {statsItems.map(({ label, value }) => (
          <div key={label} className="flex">
            <dt className="mr-2 font-bold leading-[12px]">{label}:</dt>
            <dd className="leading-[12px]">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
