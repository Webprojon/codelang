import type { ReactNode } from 'react';
import { PiCodeBold } from 'react-icons/pi';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full h-[60px] bg-blue-600 flex items-center pl-4">
        <PiCodeBold className="text-2xl text-white" aria-hidden="true" />
      </div>
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="w-full max-w-[600px]">
          <h1 className="text-[32px] font-normal text-black mb-2 font-sans">
            Codelang
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}
