import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '@shared/layouts/Layout';
import { ProtectedRoute } from '@shared/components/layout';
import { useInitAuth } from '@features/auth/hooks/useInitAuth';
import { useAuthStore } from '@features/auth/store/authStore';
import { PageLoader } from '@shared/components/feedback';
import { NotFound } from '@shared/components/layout';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('@features/home/pages/HomePage'));
const MyAccountPage = lazy(() => import('@features/account/pages/MyAccountPage'));
const UsersPage = lazy(() => import('@features/users/pages/UsersPage'));
const UserPage = lazy(() => import('@features/users/pages/UserPage'));
const PostSnippetPage = lazy(() => import('@features/snippets/pages/PostSnippetPage'));
const MySnippetsPage = lazy(() => import('@features/snippets/pages/MySnippetsPage'));
const SnippetDetailPage = lazy(() => import('@features/snippets/pages/SnippetDetailPage'));
const EditSnippetPage = lazy(() => import('@features/snippets/pages/EditSnippetPage'));
const QuestionsPage = lazy(() => import('@features/questions/pages/QuestionsPage'));
const PostQuestionPage = lazy(() => import('@features/questions/pages/PostQuestionPage'));
const EditQuestionPage = lazy(() => import('@features/questions/pages/EditQuestionPage'));
const QuestionDetailPage = lazy(() => import('@features/questions/pages/QuestionDetailPage'));
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@features/auth/pages/RegisterPage'));

export default function App() {
  useInitAuth();
  const isInitializing = useAuthStore(state => state.isInitializing);

  if (isInitializing) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/snippets/:id" element={<SnippetDetailPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/questions/:id" element={<QuestionDetailPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute redirectTo="/login" />}>
          <Route element={<Layout />}>
            <Route path="/my-account" element={<MyAccountPage />} />
            <Route path="/post-snippet" element={<PostSnippetPage />} />
            <Route path="/ask-question" element={<PostQuestionPage />} />
            <Route path="/my-snippets" element={<MySnippetsPage />} />
            <Route path="/snippets/:id/edit" element={<EditSnippetPage />} />
            <Route path="/questions/:id/edit" element={<EditQuestionPage />} />
          </Route>
        </Route>

        {/* Auth routes */}
        <Route element={<ProtectedRoute reverse redirectTo="/" />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
