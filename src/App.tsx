import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import Comments from './components/userinfo/Comments';
import Posts from './components/userinfo/Posts';
import LikeList from './components/post/LikeList';
import ChallengeList from './pages/ChallengeList';
import CreateChallenge from './pages/CreateChallenge';
import Challenge from './pages/Challenge';

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board" element={<Board />} />
        <Route path="/board/:id" element={<Post />}>
          <Route path="likes" element={<LikeList />} />
        </Route>
        <Route path="/board/:id/edit" element={<EditPost />} />
        <Route path="/board/new" element={<WritePost />} />
        <Route path="/user/:id" element={<UserInfo />}>
          <Route path="settings" element={<Settings />} />
          <Route path="comments" element={<Comments />} />
          <Route path="posts" element={<Posts />} />
        </Route>
        <Route path="/challenge" element={<ChallengeList />} />
        <Route path="/challenge/:id" element={<Challenge />} />
        <Route path="/challenge/new" element={<CreateChallenge />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="top-right" // 알람 위치 지정
        autoClose={3000} // 자동 off 시간
        hideProgressBar={false} // 진행시간바 숨김
        closeOnClick // 클릭으로 알람 닫기
        rtl={false} // 알림 좌우 반전
        pauseOnFocusLoss // 화면을 벗어나면 알람 정지
        draggable // 드래그 가능
        pauseOnHover // 마우스를 올리면 알람 정지
        theme="light"
        // limit={1} // 알람 개수 제한
      />
    </BrowserRouter>
  );
}

export default App;
