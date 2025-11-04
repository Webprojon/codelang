import { Route, Routes } from 'react-router-dom';
import Layout from './shared/layouts/Layout';
import ProtectedRoute from './shared/components/ProtectedRoute';

import HomePage from './features/home/pages/HomePage';
import MyAccountPage from './features/account/pages/MyAccountPage';
import UsersPage from './features/users/pages/UsersPage';
import PostSnippetPage from './features/snippets/pages/PostSnippetPage';
import MySnippetsPage from './features/snippets/pages/MySnippetsPage';
import QuestionsPage from './features/questions/pages/QuestionsPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import NotFound from './shared/components/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
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
