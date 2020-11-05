import useSWR from 'swr';
import { parseJwt } from '../lib/helpers';
import { useEffect, useState } from 'react';

export const fetcher = (url) => fetch(url).then((r) => r.json());

export function useJWT() {
  const { data, mutate } = useSWR('/api/jwt', fetcher);
  // if data is not defined, the query has not completed
  const loading = !data;
  const token = data?.accessToken;

  return [parseJwt(token), { mutate, loading }];
}

const cache = {};

export const useFetch = (url) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setStatus('fetching');
      if (cache[url]) {
        const data = cache[url];
        setData(data);
        setStatus('fetched');
      } else {
        const response = await fetch(url);
        const body = await response.text();
        const data = body.length > 0 ? body : null;

        cache[url] = data;
        setData(data);
        setStatus('fetched');
      }
    };

    fetchData();
  }, [url]);

  return { status, data };
};
