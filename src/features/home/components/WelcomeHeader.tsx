import { PiCodeBold } from 'react-icons/pi';

export default function WelcomeHeader({ title }: { title: string }) {
  return (
    <div className="flex justify-center items-center flex-col gap-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      <PiCodeBold className="size-9" />
    </div>
  );
}
