import useSWR from 'swr';

export const fetcher = (url) => fetch(url).then((r) => r.json());

export function useUser() {
  const { data, mutate } = useSWR('/api/user', fetcher);
  // if data is not defined, the query has not completed
  const loading = !data;
  const user = data?.user;
  return [user, { mutate, loading }];
}

export function useCurrentUser() {
  const { data, mutate } = useSWR('/api/user', fetcher);
  const user = data?.user;
  return [user, { mutate }];
}
