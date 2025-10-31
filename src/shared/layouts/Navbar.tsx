import { IoLanguage } from 'react-icons/io5';
import { HiMenu } from 'react-icons/hi';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation().pathname;

  return (
    <nav
      className="flex items-center justify-between pl-4 pr-2 md:pr-6 h-[70px] w-full min-w-0 select-none text-slate-300 bg-brand-600"
      aria-label="Top Navigation Bar"
    >
      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
        <Logo />
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 sidebar-btn"
          aria-label="Toggle sidebar menu"
        >
          <HiMenu className="size-6 text-white" />
        </button>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <div className="flex gap-1 md:gap-2">
          {location === '/questions' && (
            <Button
              className="bg-white text-gray-600 hover:bg-gray-100"
              aria-label="Ask a question"
            >
              Ask Question
            </Button>
          )}
          <Button
            className="bg-white text-gray-600 hover:bg-gray-100 uppercase"
            aria-label="Sign out"
          >
            Sign Out
          </Button>
        </div>
        <Button
          className="flex items-center"
          icon={
            <IoLanguage
              className="size-6 text-white"
              aria-hidden="true"
              focusable="false"
            />
          }
          aria-label="Change language"
        >
          <span>EN</span>
        </Button>
      </div>
    </nav>
  );
}
