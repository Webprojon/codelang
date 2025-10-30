import { Link, NavLink } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { MdHome } from 'react-icons/md';
import { FaChevronLeft, FaChevronRight, FaUsers } from 'react-icons/fa';
import { FaCircleQuestion, FaUserLarge } from 'react-icons/fa6';
import { HiFolder, HiFolderOpen } from 'react-icons/hi';
import UserImg from '../assets/images/1.jpg';

const SidebarLinks = [
  {
    to: '/',
    label: 'Home',
    icon: <MdHome className="size-6" />,
  },
  {
    to: '/my-account',
    label: 'My Account',
    icon: <FaUserLarge className="size-5" />,
  },
  {
    to: '/post-snippet',
    label: 'Post snippet',
    icon: <HiFolderOpen className="size-6" />,
  },
  {
    to: '/my-snippets',
    label: 'My snippets',
    icon: <HiFolder className="size-6" />,
  },
  {
    to: '/questions',
    label: 'Questions',
    icon: <FaCircleQuestion className="size-5" />,
  },
  { to: '/users', label: 'Users', icon: <FaUsers className="size-6" /> },
];

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
    <div className={`sidebar ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div
        className={`sidebar-header ${isCollapsed ? 'justify-center' : 'justify-between'}`}
      >
        <Link to={`/user/${user.id}`} className="link-inline inline-center">
          <div className="avatar flex-center">
            {user.userImg ? (
              <img
                src={user.userImg}
                alt={user.name}
                loading="lazy"
                className="avatar-img"
              />
            ) : (
              user.name.slice(0, 1).toUpperCase()
            )}
          </div>
          <span className={`${isCollapsed && 'hidden'}`}>{user.name}</span>
        </Link>
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
          {SidebarLinks.map(link => (
            <li
              key={link.to}
              className={`${isCollapsed ? 'px-0 pb-2' : 'px-2 pb-2 rounded-md'}`}
            >
              <NavLink
                to={link.to}
                className={({ isActive }: { isActive: boolean }) =>
                  `inline-center nav-item-base ${isActive ? 'nav-item-active' : 'nav-item-hover'} ${isCollapsed ? 'justify-center' : 'rounded-sm'}`
                }
              >
                <div className="w-6">{link.icon}</div>
                <span className={`font-extralight ${isCollapsed && 'hidden'}`}>
                  {link.label}
                </span>
              </NavLink>
            </li>
          ))}
          {isCollapsed && (
            <button
              type="button"
              onClick={handleCollapse}
              aria-label="Expand sidebar"
              className="center-btn flex-center"
            >
              <FaChevronRight className="cursor-pointer" />
            </button>
          )}
        </ul>
      </nav>
    </div>
  );
}
