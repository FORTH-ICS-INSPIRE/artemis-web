import useSWR from 'swr';
import { parseJwt } from '../lib/helpers';

export const fetcher = (url) => fetch(url).then((r) => r.json());  

export function useJWT() {
  const { data, mutate } = useSWR('/api/jwt', fetcher);
  // if data is not defined, the query has not completed
  const loading = !data;
  const token = data?.accessToken;

  return [parseJwt(token), { mutate, loading }];
}