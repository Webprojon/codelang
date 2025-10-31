import { Link, NavLink } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import UserImg from '../../assets/images/1.jpg';
import { sidebarNavigationLinks } from '../config/navigation';
import Avatar from '../components/Avatar';

const user = {
  id: 1,
  name: 'Danis',
  userImg: UserImg,
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  return (
    <div
      className={`flex flex-col h-full overflow-y-auto overflow-x-hidden transition-all duration-300 shrink-0 select-none text-slate-300 bg-brand-700 ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      <div
        className={`flex items-center pl-4 pr-2 py-4 border-b border-blue-700 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
      >
        <div className="gap-3 flex items-center">
          <Avatar
            size="md"
            name={user.name}
            userId={user.id}
            imageUrl={user.userImg}
          />
          {!isCollapsed && (
            <Link
              to={`/user/${user.id}`}
              className="cursor-pointer hover:underline"
            >
              {user.name}
            </Link>
          )}
        </div>
        {!isCollapsed && (
          <button
            type="button"
            onClick={handleCollapse}
            aria-label="Collapse sidebar"
          >
            <FaChevronLeft className="cursor-pointer" />
          </button>
        )}
      </div>

      <nav className="flex-1 mt-2">
        <ul className="flex flex-col">
          {sidebarNavigationLinks.map(link => {
            const IconComponent = link.icon;
            return (
              <li
                key={link.to}
                className={`${isCollapsed ? 'px-0 pb-2' : 'px-2 pb-2 rounded-md'}`}
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-5 p-3 rounded-sm transition-all ${
                      isActive ? 'bg-brand-500' : 'hover:bg-brand-500'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                >
                  <div className="w-6">
                    <IconComponent className={link.iconSize || 'size-6'} />
                  </div>
                  <span
                    className={`font-extralight ${isCollapsed && 'hidden'}`}
                  >
                    {link.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
          {isCollapsed && (
            <button
              type="button"
              onClick={handleCollapse}
              aria-label="Expand sidebar"
              className="p-4 transition-all hover:bg-brand-500 flex justify-center items-center"
            >
              <FaChevronRight className="cursor-pointer" />
            </button>
          )}
        </ul>
      </nav>
    </div>
  );
}
