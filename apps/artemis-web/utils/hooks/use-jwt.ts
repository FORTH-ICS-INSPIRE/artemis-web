import { parseJwt } from '../../utils/parsers';
import { useEffect, useState } from 'react';

export function useJWT() {
  const { status, data } = useFetch('/api/auth/jwt');
  const jwt = data ? parseJwt(data) : null;
  const user = jwt ? jwt.user : null;
  const loading = status !== 'fetched';
  return [user, loading];
}

const cache = {};

export const useFetch = (url) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState('');

  useEffect(() => {
    let mounted = true;
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
        if (mounted) {
          setData(data);
          setStatus('fetched');
        }
      }
    };

    fetchData();
    return () => (mounted = false);
  }, [url]);

  return { status, data };
};
