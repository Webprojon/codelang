import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@shared/components/ui/Button';
import Input from '@shared/components/ui/Input';
import { useAuth } from '@features/auth/hooks/useAuth';
import { USERNAME_VALIDATION, PASSWORD_VALIDATION } from '@shared/utils/validations';

interface AuthFormProps {
  type: 'login' | 'register';
}

interface FormData {
  username: string;
  password: string;
  confirmPassword?: string;
}

const FORM_DEFAULT_VALUES: FormData = {
  username: '',
  password: '',
  confirmPassword: '',
};

export default function AuthForm({ type }: AuthFormProps) {
  const navigate = useNavigate();
  const { loginMutation, registerMutation, isLoggingIn, isRegistering } = useAuth();

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

  const handleRegister = (data: FormData) => {
    registerMutation.mutate(
      { username: data.username, password: data.password },
      {
        onSuccess: () => {
          navigate('/login');
        },
        onError: error => {
          setError('root', { message: error.message });
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
        onError: error => {
          setError('root', { message: error.message });
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 font-sans">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm text-gray-600 font-sans">
          {type === 'login'
            ? 'Sign in to your Codelang account'
            : 'Sign up to create your Codelang account'}
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Username"
          id="username"
          type="text"
          placeholder="Enter your username"
          error={errors.username?.message}
          labelClassName="form-label"
          inputClassName="form-input"
          {...register('username', USERNAME_VALIDATION)}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          labelClassName="form-label"
          inputClassName="form-input"
          {...register('password', PASSWORD_VALIDATION)}
        />

        {type === 'register' && (
          <Input
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            labelClassName="form-label"
            inputClassName="form-input"
            {...register('confirmPassword', confirmPasswordValidation)}
          />
        )}

        {errors.root && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{errors.root.message}</div>
        )}
      </div>

      <div className="mt-6">
        <Button
          size="lg"
          fullWidth
          type="submit"
          color="primary"
          disabled={isSubmittingForm}
          className="font-medium font-sans"
        >
          {isSubmittingForm ? 'Processing...' : type === 'login' ? 'Sign In' : 'Sign Up'}
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
