import type { ReactNode } from 'react';
import { PiCodeBold } from 'react-icons/pi';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <section className="min-h-screen flex-center bg-white p-4 select-none">
      <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-auth w-full md:w-[980px] h-auto md:h-[500px]">
        <div className="flex-1 bg-brand-500 flex-center flex-col gap-6 px-8 py-6 sm:py-12 md:h-full">
          <Link to="/" className="flex-center gap-3 text-white">
            <PiCodeBold className="size-8 sm:size-14 text-white" />
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold leading-none">
              Codelang
            </h1>
          </Link>
          <p className="sm:text-lg text-white text-center">
            Master your coding skills with daily practice!
          </p>
        </div>

        <div className="flex-1 bg-white flex-center px-4 sm:px-8 py-6 sm:py-12 min-h-[400px] md:h-full">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </section>
  );
}
