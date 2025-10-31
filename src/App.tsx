import { Route, Routes } from 'react-router-dom';
import Layout from './shared/layouts/Layout';

import HomePage from './features/home/pages/HomePage';
import MyAccountPage from './features/account/pages/MyAccountPage';
import UsersPage from './features/users/pages/UsersPage';
import PostSnippetPage from './features/snippets/pages/PostSnippetPage';
import MySnippetsPage from './features/snippets/pages/MySnippetsPage';
import QuestionsPage from './features/questions/pages/QuestionsPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/post-snippet" element={<PostSnippetPage />} />
        <Route path="/my-snippets" element={<MySnippetsPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
