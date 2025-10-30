import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MyAccountPage from './pages/MyAccountPage';
import UsersPage from './pages/UsersPage';
import PostSnippetPage from './pages/PostSnippetPage';
import MySnippetsPage from './pages/MySnippetsPage';
import QuestionsPage from './pages/QuestionsPage';
import Layout from './components/Layout';

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
    </Routes>
  );
}
