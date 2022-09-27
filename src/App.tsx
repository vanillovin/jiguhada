import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import NavigationBar from './components/NavigationBar';
import UserInfo from './pages/UserInfo';
import Board from './pages/Board';
import Settings from './components/userinfo/Settings';
import Post from './pages/Post';
import EditPost from './pages/EditPost';
import WritePost from './pages/WritePost';

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board" element={<Board />} />
        <Route path="/board/:id" element={<Post />} />
        <Route path="/board/:id/edit" element={<EditPost />} />
        <Route path="/board/new" element={<WritePost />} />
        <Route path="/user/:id" element={<UserInfo />}>
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
