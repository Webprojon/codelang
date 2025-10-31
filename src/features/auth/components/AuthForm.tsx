import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';

interface AuthFormProps {
  type: 'login' | 'register';
}

interface FormData {
  username: string;
  password: string;
  confirmPassword?: string;
}

export default function AuthForm({ type }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    console.log(data);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const labelClasses = 'text-gray-700 text-sm';
  const inputClasses =
    'text-gray-800 placeholder:text-gray-400 focus:border-brand-500';

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
          labelClassName={labelClasses}
          inputClassName={inputClasses}
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
            },
          })}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          labelClassName={labelClasses}
          inputClassName={inputClasses}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
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
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match',
            })}
          />
        )}
      </div>

      <div className="mt-6">
        <Button
          type="submit"
          className="w-full py-3 bg-brand-500 text-white font-medium font-sans hover:bg-brand2-500"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Processing...'
            : type === 'login'
              ? 'Sign In'
              : 'Sign Up'}
        </Button>
      </div>

      <div className="mt-4 text-center text-sm font-sans text-gray-600">
        {type === 'login' ? (
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-medium">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
