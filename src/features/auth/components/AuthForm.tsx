import { Link } from 'react-router-dom';
import Input from '../../../shared/components/Input';

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function AuthForm({ type }: AuthFormProps) {
  const isLogin = type === 'login';
  const inputIdPrefix = isLogin ? '' : 'register-';

  return (
    <>
      <form>
        <Input
          id={`${inputIdPrefix}username`}
          type="text"
          label="Username"
          placeholder="Your username"
          containerClassName="mb-6"
        />

        <Input
          id={`${inputIdPrefix}password`}
          type="password"
          label="Password"
          placeholder="Enter your password"
          containerClassName={isLogin ? 'mb-8' : 'mb-6'}
        />

        {!isLogin && (
          <Input
            id="confirm-password"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            containerClassName="mb-8"
          />
        )}

        <button
          type="submit"
          className="text-base text-black bg-transparent border-0 p-0 cursor-pointer font-sans mb-8"
        >
          {isLogin ? 'Sign in' : 'Sign up'}
        </button>
      </form>

      <div className="text-base text-black font-sans">
        {isLogin ? (
          <>
            <span>No account yet? </span>
            <Link to="/register" className="text-black underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            <span>Already have an account? </span>
            <Link to="/login" className="text-black underline">
              Sign in
            </Link>
          </>
        )}
      </div>
    </>
  );
}
