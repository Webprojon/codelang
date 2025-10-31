import { IoLanguage } from 'react-icons/io5';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation().pathname;

  return (
    <nav
      className="flex items-center justify-between pl-4 pr-6 h-[70px] w-full min-w-0 select-none text-slate-300 bg-brand-600"
      aria-label="Top Navigation Bar"
    >
      <Logo />
      <div className="flex items-center gap-5">
        <div className="flex gap-2">
          {location === '/questions' && (
            <Button variant="white" aria-label="Ask a question">
              Ask Question
            </Button>
          )}
          <Button variant="white-uppercase" aria-label="Sign out">
            Sign Out
          </Button>
        </div>
        <Button
          variant="icon"
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
