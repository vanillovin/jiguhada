import { useInfiniteQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { getChallengeAuthCommentList } from '../../modules/challenge/api';
import { currentUserState } from '../../modules/user/atom';
import Loading from '../Loading';

const authIsApproveData = {
  APPROVE: ['승인 완료', 'text-jghd-green'],
  WAIT: ['승인 대기 중', 'text-jghd-blue'],
  REFUSE: ['승인 거절', 'text-jghd-red'],
};

function ChallengeAuthCommentList({ id }: { id: string }) {
  const currentUser = useRecoilValue(currentUserState);

  const fetchComments = (page: number) =>
    getChallengeAuthCommentList(currentUser?.accessToken as string, +id, page);

  const {
    isLoading,
    data,
    isFetching,
    isFetchingNextPage,
    // error,
    // fetchNextPage,
    // hasNextPage,
    // refetch,
    // status,
  } = useInfiniteQuery(
    ['ChallengeAuthCommentList', id],
    ({ pageParam = 1 }) => fetchComments(pageParam),
    {
      retry: 2,
      refetchOnWindowFocus: false,
      enabled: Boolean(currentUser),
      // keepPreviousData: true,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.currentPage < lastPage.totalPage ? nextPage : undefined;
      },
      onSuccess: (res) => {
        console.log('getChallengeAuthCommentList res :', res);
      },
      onError: (err) => {
        console.log('getChallengeAuthCommentList err :', err);
      },
    }
  );

  return !isLoading ? (
    <div className="h-full overflow-y-auto cmt">
      <div className="font-medium text-sm md:text-base py-2 px-3">
        인증 수 {data?.pages[0].totalCount}개
      </div>
      <ul>
        {data?.pages.map((page) =>
          page.challengeAuthList.map((auth) => (
            <li key={auth.challengeAuthId} className="flex items-start px-3 py-2">
              <div className="w-8 h-8 mt-1 mr-2">
                <img
                  src={auth.userProfileImgUrl}
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="w-full flex items-center justify-between">
                    <div className="w-full flex items-center justify-between">
                      <div className="font-medium text-sm">{auth.nickname}</div>
                      <div
                        className={`text-sm font-medium ${
                          authIsApproveData[auth.authIsApprove][1]
                        }`}
                      >
                        {authIsApproveData[auth.authIsApprove][0]}
                      </div>
                    </div>
                    <span className="ml-1 text-gray-4 text-2xs md:text-xs">
                      {/* {getDateText(auth.date)} */}
                    </span>
                  </div>
                </div>
                {true ? <p className="text-sm">{auth.authContent}</p> : <></>}
                <img className="mt-1 w-full" src={auth.authImgUrl} />
              </div>
            </li>
          ))
        )}
      </ul>
      {/* {hasNextPage ? (
        <button className="font-medium m-1 text-sm md:text-base" onClick={fetchNextPage}>
          댓글 더 보기
        </button>
      ) : (
        data?.pageParams.length > 1 && (
          <p className="font-medium text-gray-4 m-1 text-sm md:text-base">
            마지막 댓글입니다
          </p>
        )
      )} */}
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </div>
  ) : (
    <Loading />
  );
}

export default ChallengeAuthCommentList;
