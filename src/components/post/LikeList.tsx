import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getLikeRequest } from '../../modules/board/api';

export default function LikeList() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery(['Like', id], () => getLikeRequest(+id));
  // console.log('Like data', data);

  useEffect(() => {
    document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;
    height: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, []);

  return (
    <div
      onClick={(e) => {
        console.log(e.target === e.currentTarget);
        if (e.target === e.currentTarget) {
          navigate(`/board/${id}`);
        }
      }}
      className="absolute w-full h-full bg-black bg-opacity-60 flex items-center justify-center top-0 left-0 z-50"
    >
      <div className="md:w-2/6 w-full h-full md:h-3/5 bg-white p-2 md:rounded-lg">
        <div className="flex items-center justify-between">
          <button className=""></button>
          <h1 className="ml-4 text-lg font-semibold">좋아요</h1>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center px-2 font-bold text-lg hover:bg-gray-200 transition-colors"
            onClick={() => navigate(`/board/${id}`)}
          >
            ✕
          </button>
        </div>
        <ul>
          {data?.likeList.map((like) => (
            <li key={like.likeId} className="flex items-center border-b p-2">
              <div className="w-12 h-12 mr-2">
                <img
                  src={like.userImgUrl}
                  className="w-full h-full rounded-full"
                />
              </div>
              <div>
                <p>{like.nickname}</p>
                <p>@{like.username}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
