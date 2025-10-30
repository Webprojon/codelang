import { IoLanguage } from 'react-icons/io5';
import Logo from './Logo';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation().pathname;

  return (
    <nav className="navbar" aria-label="Top Navigation Bar">
      <Logo />
      <div className="inline-center gap-5">
        <div className="flex gap-2">
          {location === '/questions' && (
            <button
              type="button"
              className="btn-white"
              aria-label="Ask a question"
            >
              Ask Question
            </button>
          )}
          <button
            type="button"
            className="btn-white-uppercase"
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </div>
        <button
          type="button"
          className="icon-btn inline-center"
          aria-label="Change language"
        >
          <IoLanguage
            className="size-6 text-white"
            aria-hidden="true"
            focusable="false"
          />
          <span>EN</span>
        </button>
      </div>
    </nav>
  );
}
