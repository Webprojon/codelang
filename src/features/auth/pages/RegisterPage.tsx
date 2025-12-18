import AuthLayout from '@shared/layouts/AuthLayout';
import AuthForm from '@features/auth/components/AuthForm';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthForm type="register" />
    </AuthLayout>
  );
}
