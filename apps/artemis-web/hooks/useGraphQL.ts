import { useQuery, useSubscription } from '@apollo/client';
import {
  BGP_QUERY,
  BGP_SUB,
  HIJACK_QUERY,
  HIJACK_SUB,
  STATS_QUERY,
  STATS_SUB,
} from '../utils/graphql';

export function useGraphQl(module, isProduction) {
  let data: any;

  switch (module) {
    case 'stats':
      if (isProduction) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useSubscription(STATS_SUB).data;
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useQuery(STATS_QUERY).data;
      }
      break;
    case 'hijack':
      if (isProduction) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useSubscription(HIJACK_SUB).data;
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useQuery(HIJACK_QUERY).data;
      }
      break;
    case 'bgpupdates':
      if (isProduction) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useSubscription(BGP_SUB).data;
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useQuery(BGP_QUERY).data;
      }
      break;
  }

  return data;
}
