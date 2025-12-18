import { IoLogOutOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import Button from '@shared/components/ui/Button';
import UserStats from '@features/account/components/UserStats';
import type { User } from '@features/auth/types';
import type { UserStats as UserStatsType } from '@features/account/types';
import { FaUserLarge } from 'react-icons/fa6';

interface ProfileCardProps {
  user: User;
  stats: UserStatsType;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
}

export default function ProfileCard({ user, stats, onLogout, onDeleteAccount }: ProfileCardProps) {
  return (
    <article className="border border-gray-200 rounded-sm shadow-sm p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-18">
        <figure
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
          aria-label="Profile picture"
        >
          <FaUserLarge
            className="text-gray-300 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24"
            aria-hidden="true"
          />
        </figure>

        <section className="text-center sm:text-left w-full sm:w-auto">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{user.username}</h2>
          <p className="text-xs text-gray-500">Id: {user.id}</p>
          <p className="text-xs text-gray-500">Role: {user.role}</p>
          <div className="flex flex-row gap-2 sm:gap-3 mt-4 justify-center sm:justify-start">
            <Button
              icon={<IoLogOutOutline className="text-orange-100" aria-hidden="true" />}
              className="w-full sm:w-auto justify-center"
              color="warning"
              size="md"
              aria-label="Logout"
              onClick={onLogout}
            />
            <Button
              icon={<RiDeleteBinLine className="text-red-200" aria-hidden="true" />}
              className="shadow-2xl w-full sm:w-auto justify-center"
              color="danger"
              size="md"
              aria-label="Delete account"
              onClick={onDeleteAccount}
            />
          </div>
        </section>
      </div>

      <UserStats stats={stats} />
    </article>
  );
}
