import { NavLink } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import { sidebarNavigationLinks } from '../config/navigation';
import Button from '../components/Button';
import UserAvatar from '../components/UserAvatar';
import { useAuthStore } from '../../features/auth/store/authStore';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAuthStore(state => state.user);

  const handleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={`flex flex-col h-full overflow-y-auto overflow-x-hidden transition-all duration-300 shrink-0 select-none text-slate-300 bg-brand-700 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {user && (
        <div
          className={`flex items-center py-2 border-b border-blue-700 ${isCollapsed ? 'pl-0 pr-0 justify-center' : 'pl-3 pr-2 justify-between'}`}
        >
          <UserAvatar isCollapsed={isCollapsed} onLinkClick={onClose} />

          <div className="flex items-center gap-2">
            {!isCollapsed && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1 rounded-md hover:bg-brand-500 transition-colors"
                aria-label="Close sidebar"
              >
                <HiX className="cursor-pointer size-5" />
              </button>
            )}
            {!isCollapsed && (
              <button
                type="button"
                onClick={handleCollapse}
                className="hidden lg:block"
                aria-label="Collapse sidebar"
              >
                <FaChevronLeft className="cursor-pointer" />
              </button>
            )}
          </div>
        </div>
      )}

      <nav className="flex-1 mt-2 flex flex-col justify-between pb-2">
        <ul className="flex flex-col">
          {sidebarNavigationLinks.map(link => {
            const IconComponent = link.icon;
            return (
              <li key={link.to} className={`${isCollapsed ? 'px-0 pb-2' : 'px-2 pb-2 rounded-md'}`}>
                <NavLink
                  to={link.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-5 p-3 rounded-sm transition-all ${
                      isActive ? 'bg-brand-500' : 'hover:bg-brand-500'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                  onClick={onClose}
                >
                  <div className="w-6">
                    <IconComponent className={link.iconSize || 'size-6'} />
                  </div>
                  <span className={`font-extralight ${isCollapsed && 'hidden'}`}>{link.label}</span>
                </NavLink>
              </li>
            );
          })}
          {isCollapsed && (
            <button
              type="button"
              onClick={handleCollapse}
              aria-label="Expand sidebar"
              className="p-4 transition-all hover:bg-brand-500 flex-center"
            >
              <FaChevronRight className="cursor-pointer" />
            </button>
          )}
        </ul>
        <Button className="mx-2 sm:hidden btn-white" aria-label="Sign out">
          Sign Out
        </Button>
      </nav>
    </div>
  );
}
