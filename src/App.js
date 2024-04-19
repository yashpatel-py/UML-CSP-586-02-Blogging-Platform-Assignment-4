import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Blog from './components/Blog';
import SignUp from './components/signup';
import Login from './components/login';
import CreatePost from './components/create_blog';
import ReadPost from './components/read_post';
import ManagePosts from './components/Manage-Posts';
import ManageUsers from './components/manage-users';
import SubscribePage from './components/subscribe_page';
import SearchPage from './components/search_page';
import ActivityRecommendation from './components/ActivityRecommendation';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/read-post/:postId" element={<ReadPost />} />
        <Route path="/manage-posts" element={<ManagePosts />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/subscribe-page" element={<SubscribePage />} />
        <Route path="/search-page" element={<SearchPage />} />
        <Route path="/acivity_recomend" element={<ActivityRecommendation />} />
      </Routes>
    </Router>
  );
};

export default App;
