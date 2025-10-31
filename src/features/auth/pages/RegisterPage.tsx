import AuthLayout from '../../../shared/layouts/AuthLayout';
import AuthForm from '../components/AuthForm';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthForm type="register" />
    </AuthLayout>
  );
}
