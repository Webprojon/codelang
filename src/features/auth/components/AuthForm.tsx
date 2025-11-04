import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { useAuth } from '../hooks/useAuth';

interface AuthFormProps {
  type: 'login' | 'register';
}

interface FormData {
  username: string;
  password: string;
  confirmPassword?: string;
}

const USERNAME_VALIDATION = {
  required: 'Username is required',
  minLength: { value: 3, message: 'Username must be at least 3 characters' },
  maxLength: { value: 30, message: 'Username must be less than 30 characters' },
  pattern: {
    value: /^[a-zA-Z0-9_-]+$/,
    message: 'Username can only contain letters, numbers, underscores, and hyphens',
  },
};

const PASSWORD_VALIDATION = {
  required: 'Password is required',
  minLength: { value: 6, message: 'Password must be at least 6 characters' },
  maxLength: { value: 128, message: 'Password must be less than 128 characters' },
  validate: {
    hasLetter: (value?: string) =>
      value ? /[a-zA-Z]/.test(value) || 'Password must contain at least one letter' : true,
    hasNumber: (value?: string) =>
      value ? /[0-9]/.test(value) || 'Password must contain at least one number' : true,
  },
};

const FORM_DEFAULT_VALUES: FormData = {
  username: '',
  password: '',
  confirmPassword: '',
};

export default function AuthForm({ type }: AuthFormProps) {
  const navigate = useNavigate();
  const { loginMutation, registerMutation, isLoggingIn, isRegistering, loginError, registerError } =
    useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const password = watch('password');

  const confirmPasswordValidation = {
    required: 'Please confirm your password',
    validate: (value?: string) => value === password || 'Passwords do not match',
  };

  useEffect(() => {
    const error = type === 'register' ? registerError : loginError;
    if (error) {
      setError('root', { message: error.message });
    }
  }, [registerError, loginError, type, setError]);

  const handleRegister = (data: FormData) => {
    registerMutation.mutate(
      { username: data.username, password: data.password },
      {
        onSuccess: () => {
          navigate('/login');
        },
      }
    );
  };

  const handleLogin = (data: FormData) => {
    loginMutation.mutate(
      { username: data.username, password: data.password },
      {
        onSuccess: () => {
          navigate('/');
        },
      }
    );
  };

  const onSubmit = (data: FormData) => {
    if (type === 'register') {
      handleRegister(data);
    } else {
      handleLogin(data);
    }
  };

  const isSubmittingForm = isSubmitting || (type === 'register' ? isRegistering : isLoggingIn);

  const labelClasses = 'text-gray-700 text-sm';
  const inputClasses = 'text-gray-800 placeholder:text-gray-400 focus:border-brand-500';

  const titleText = type === 'login' ? 'Welcome Back' : 'Create Account';
  const subtitleText =
    type === 'login'
      ? 'Sign in to your Codelang account'
      : 'Sign up to create your Codelang account';
  const buttonText = isSubmittingForm ? 'Processing...' : type === 'login' ? 'Sign In' : 'Sign Up';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 font-sans">{titleText}</h2>
        <p className="text-sm text-gray-600 font-sans">{subtitleText}</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Username"
          id="username"
          type="text"
          placeholder="Enter your username"
          error={errors.username?.message}
          labelClassName={labelClasses}
          inputClassName={inputClasses}
          {...register('username', USERNAME_VALIDATION)}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          labelClassName={labelClasses}
          inputClassName={inputClasses}
          {...register('password', PASSWORD_VALIDATION)}
        />

        {type === 'register' && (
          <Input
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            labelClassName={labelClasses}
            inputClassName={inputClasses}
            {...register('confirmPassword', confirmPasswordValidation)}
          />
        )}

        {errors.root && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{errors.root.message}</div>
        )}
      </div>

      <div className="mt-6">
        <Button
          type="submit"
          className="w-full py-3 bg-brand-500 text-white font-medium font-sans hover:bg-brand2-500"
          disabled={isSubmittingForm}
        >
          {buttonText}
        </Button>
      </div>

      <div className="mt-4 text-center text-sm font-sans text-gray-600">
        <p>
          {type === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <Link to={type === 'login' ? '/register' : '/login'} className="font-medium">
            {type === 'login' ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </form>
  );
}
