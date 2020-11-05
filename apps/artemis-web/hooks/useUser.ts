import useSWR from 'swr';

export const fetcher = (url) => fetch(url).then((r) => r.json());

export function useUser() {
  const { data, mutate } = useSWR('/api/user', fetcher);
  // if data is not defined, the query has not completed
  const loading = !data;
  console.log(data)
  const user = null


  return [user, { mutate, loading }];
}