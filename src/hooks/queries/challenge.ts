import { GetChallengeListParams } from './../../modules/challenge/type';
import { getChallengeList } from './../../modules/challenge/api';
import { useQuery, UseQueryOptions } from 'react-query';
import { ChallengeList } from '../../modules/challenge/type';

// interface UseQueryOptions<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>
export const useGetChallengeList = (
  params: GetChallengeListParams,
  options?: UseQueryOptions<
    ChallengeList,
    { message: string },
    ChallengeList,
    [string, GetChallengeListParams]
  >
) => {
  return useQuery(['ChallengeList', params], () => getChallengeList(params), {
    retry: 2,
    ...options,
  });
};
