import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import { sidebarNavigationLinks } from '@shared/utils/navigation';
import Button from '@shared/components/ui/Button';
import UserAvatar from '@shared/components/ui/UserAvatar';
import { useAuthStore } from '@features/auth/store/authStore';
import { useAuth } from '@features/auth/hooks/useAuth';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAuthStore(state => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutMutation, isLoggingOut } = useAuth();

  const isSnippetDetailPage = /^\/snippets\/[^/]+$/.test(location.pathname);

  const handleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

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
              <Button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1 rounded-md hover:bg-brand-500 transition-colors"
                size="sm"
                aria-label="Close sidebar"
                icon={<HiX className="cursor-pointer size-5" />}
              />
            )}
            {!isCollapsed && (
              <Button
                type="button"
                onClick={handleCollapse}
                className="hidden lg:block"
                size="sm"
                aria-label="Collapse sidebar"
                icon={<FaChevronLeft className="cursor-pointer" />}
              />
            )}
          </div>
        </div>
      )}

      <nav className="flex-1 mt-2 flex flex-col justify-between pb-2">
        <ul className="flex flex-col">
          {sidebarNavigationLinks.map(link => {
            const IconComponent = link.icon;
            const shouldBeActive = isSnippetDetailPage ? link.to === '/' : undefined;
            return (
              <li key={link.to} className={`${isCollapsed ? 'px-0 pb-2' : 'px-2 pb-2 rounded-md'}`}>
                <NavLink
                  to={link.to}
                  className={({ isActive }: { isActive: boolean }) => {
                    const active = shouldBeActive !== undefined ? shouldBeActive : isActive;
                    return `flex items-center gap-5 p-3 rounded-sm transition-all ${
                      active ? 'bg-brand-500' : 'hover:bg-brand-500'
                    } ${isCollapsed ? 'justify-center' : ''}`;
                  }}
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
            <Button
              type="button"
              onClick={handleCollapse}
              aria-label="Expand sidebar"
              className="p-4 bordertransition-all hover:bg-brand-500 flex-center"
              size="lg"
              icon={<FaChevronRight className="cursor-pointer" />}
            />
          )}
        </ul>
        <Button
          className="mx-2 sm:hidden font-bold"
          size="md"
          aria-label="Sign out"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </Button>
      </nav>
    </div>
  );
}
