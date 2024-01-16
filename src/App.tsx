import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import HomePage from './pages/home/HomePage';
import RegisterPage from './pages/register/RegisterPage';
import BoardPage from './pages/board/BoardPage';
import PostPage from './pages/board/PostPage';
import LikeList from './pages/board/LikeList';
import EditPostPage from './pages/board/EditPostPage';
import WritePostPage from './pages/board/WritePostPage';
import UserInfoPage from './pages/user/UserInfoPage';
import Settings from './pages/user/Settings';
import ChallengePage from './pages/challenge/ChallengePage';
import ChallengeDetailPage from './pages/challenge/ChallengeDetailPage';
import CreateChallengePage from './pages/challenge/CreateChallengePage';
import NotFoundPage from './pages/NotFoundPage';
import CreatedPosts from './pages/user/CreatedPosts';
import CreatedComments from './pages/user/CreatedComments';

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/:id" element={<PostPage />}>
          <Route path="likes" element={<LikeList />} />
        </Route>
        <Route path="/board/:id/edit" element={<EditPostPage />} />
        <Route path="/board/new" element={<WritePostPage />} />
        <Route path="/user/:id" element={<UserInfoPage />}>
          <Route path="settings" element={<Settings />} />
          <Route path="comments" element={<CreatedComments />} />
          <Route path="posts" element={<CreatedPosts />} />
        </Route>
        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/challenge/:id" element={<ChallengeDetailPage />} />
        <Route path="/challenge/new" element={<CreateChallengePage />} />
        <Route path="*" element={<NotFoundPage />} />
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
