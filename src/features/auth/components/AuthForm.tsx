import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function AuthForm({ type }: AuthFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (type === 'register' && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    }

    if (type === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  };

  const labelClasses = 'text-gray-700 text-sm';
  const inputClasses =
    'text-gray-800 placeholder:text-gray-400 focus:border-brand-500';

  return (
    <form onSubmit={handleSubmit} className="w-full">
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
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
          error={errors.username}
          labelClassName={labelClasses}
          inputClassName={inputClasses}
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
          labelClassName={labelClasses}
          inputClassName={inputClasses}
        />

        {type === 'register' && (
          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            labelClassName={labelClasses}
            inputClassName={inputClasses}
          />
        )}
      </div>

      <div className="mt-6">
        <Button
          type="submit"
          variant="white"
          className="w-full py-3 bg-brand-500 text-white font-medium font-sans"
        >
          {type === 'login' ? 'Sign In' : 'Sign Up'}
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
