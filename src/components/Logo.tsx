import { memo } from 'react';
import { PiCodeBold } from 'react-icons/pi';
import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Link to="/" className="inline-center gap-2" aria-label="Codelang">
      <PiCodeBold
        className="size-6 text-white"
        aria-hidden="true"
        focusable="false"
      />
      <h1 className="text-slate-300 font-light text-lg">CODELANG</h1>
    </Link>
  );
}
export default memo(Logo);
