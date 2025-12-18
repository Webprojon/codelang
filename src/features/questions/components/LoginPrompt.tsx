import { useNavigate } from 'react-router-dom';
import Button from '@shared/components/ui/Button';

export default function LoginPrompt() {
  const navigate = useNavigate();

  return (
    <div className="mt-8 pt-8 border-t border-gray-200 text-center">
      <p className="text-gray-500 mb-4">Want to answer this question?</p>
      <Button onClick={() => navigate('/login')} color="primary" size="md">
        Login to Answer
      </Button>
    </div>
  );
}
