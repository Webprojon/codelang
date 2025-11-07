import { IoLanguage } from 'react-icons/io5';
import { HiMenu } from 'react-icons/hi';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isInitializing = useAuthStore(state => state.isInitializing);
  const { logoutMutation, isLoggingOut } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav
      className="flex items-center justify-between pl-4 pr-2 md:pr-4  h-[70px] w-full min-w-0 select-none text-slate-300 bg-brand-600"
      aria-label="Top Navigation Bar"
    >
      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
        <Logo />
        <Button
          onClick={onMenuClick}
          className="lg:hidden sidebar-btn"
          size="md"
          color="ghost"
          aria-label="Toggle sidebar menu"
          icon={<HiMenu className="size-6 text-white" />}
        />
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <div className="flex gap-1 md:gap-2">
          {pathname === '/questions' && (
            <Button className="uppercase" color="light" size="md" aria-label="Ask a question">
              Ask Question
            </Button>
          )}
          {isInitializing ? null : isAuthenticated ? (
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="uppercase"
              color="light"
              size="md"
              aria-label="Sign out"
            >
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          ) : (
            <Button
              onClick={handleLogin}
              className="uppercase"
              color="light"
              size="md"
              aria-label="Log in"
            >
              Sign in
            </Button>
          )}
        </div>
        <Button
          className="flex items-center text-slate-200"
          size="md"
          color="ghost"
          icon={<IoLanguage className="size-6 text-white" aria-hidden="true" focusable="false" />}
          aria-label="Change language"
        >
          <span>EN</span>
        </Button>
      </div>
    </nav>
  );
}
