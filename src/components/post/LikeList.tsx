import { useCallback, useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getLikesRequest } from '../../modules/board/api';

export default function LikeList() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const observerElem = useRef(null);

  const fetchLikes = (page: number) => getLikesRequest(+id, page);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(
      ['Likes', { id }],
      ({ pageParam = 1 }) => fetchLikes(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          return lastPage.currentPage < lastPage.totalPage
            ? allPages.length + 1
            : undefined;
        },
      }
    );

  console.log(isFetchingNextPage, hasNextPage);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    // top: -${window.scrollY}px
    document.body.style.cssText = `
    position: fixed; 
    overflow-y: scroll;
    width: 100%;
    height: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, []);

  useEffect(() => {
    const element = observerElem.current;
    const option = { threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [fetchNextPage, hasNextPage, handleObserver]);

  return (
    <div
      onClick={(e) => {
        // console.log(e.target === e.currentTarget);
        if (e.target === e.currentTarget) {
          navigate(`/board/${id}`);
        }
      }}
      className="absolute w-full h-full bg-black bg-opacity-60 flex items-center justify-center top-0 left-0 z-50"
    >
      <div className="llist relative w-full md:w-[500px] h-full md:h-3/4 bg-white md:rounded-lg flex flex-col overflow-y-scroll">
        <div className="sticky top-0 p-2 flex items-center justify-between bg-white bg-opacity-90">
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
          {data?.pages.map((page) =>
            page.likeList.map((like) => (
              <li
                key={like.likeId}
                onClick={() => navigate(`/user/${like.userId}`)}
                className="cursor-pointer flex items-center px-4 py-2 hover:bg-gray-2"
              >
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
            ))
          )}
          <div ref={observerElem} className="m1-1">
            {isFetchingNextPage && hasNextPage && '불러오는 중...'}
          </div>
        </ul>
      </div>
    </div>
  );
}
