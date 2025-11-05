import { Route, Routes } from 'react-router-dom';
import Layout from './shared/layouts/Layout';
import ProtectedRoute from './shared/components/ProtectedRoute';
import { useInitAuth } from './features/auth/hooks/useInitAuth';
import { useAuthStore } from './features/auth/store/authStore';
import LoadingSpinner from './shared/components/LoadingSpinner';

import HomePage from './features/home/pages/HomePage';
import MyAccountPage from './features/account/pages/MyAccountPage';
import UsersPage from './features/users/pages/UsersPage';
import PostSnippetPage from './features/snippets/pages/PostSnippetPage';
import MySnippetsPage from './features/snippets/pages/MySnippetsPage';
import SnippetDetailPage from './features/snippets/pages/SnippetDetailPage';
import QuestionsPage from './features/questions/pages/QuestionsPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import NotFound from './shared/components/NotFound';

export default function App() {
  useInitAuth();
  const isInitializing = useAuthStore(state => state.isInitializing);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/snippets/:id" element={<SnippetDetailPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute redirectTo="/login" />}>
        <Route element={<Layout />}>
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/post-snippet" element={<PostSnippetPage />} />
          <Route path="/my-snippets" element={<MySnippetsPage />} />
        </Route>
      </Route>

      {/* Auth routes */}
      <Route element={<ProtectedRoute reverse redirectTo="/" />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
