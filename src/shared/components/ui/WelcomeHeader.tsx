import { PiCodeBold } from 'react-icons/pi';

interface WelcomeHeaderProps {
  title: string;
}

export default function WelcomeHeader({ title }: WelcomeHeaderProps) {
  return (
    <div className="flex justify-center items-center flex-col gap-2 mb-4 md:mb-0">
      <h1 className="text-2xl font-bold">{title}</h1>
      <PiCodeBold className="size-9" />
    </div>
  );
}
