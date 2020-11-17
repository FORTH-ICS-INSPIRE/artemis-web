import { useQuery, useSubscription } from '@apollo/client';
import {
  BGP_QUERY,
  BGP_SUB,
  HIJACK_QUERY,
  HIJACK_SUB,
  INDEXSTATS_QUERY,
  INDEXSTATS_SUB,
  ONGOING_HIJACK_QUERY,
  ONGOING_HIJACK_SUB,
  STATS_QUERY,
  STATS_SUB,
} from '../utils/graphql';

export function useGraphQl(module, isProduction, isLive = true) {
  let data: any;

  switch (module) {
    case 'stats':
      if (isProduction && isLive) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useSubscription(STATS_SUB).data;
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useQuery(STATS_QUERY).data;
      }
      break;
    case 'ongoing_hijack':
      if (isProduction && isLive) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useSubscription(ONGOING_HIJACK_SUB).data;
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useQuery(ONGOING_HIJACK_QUERY).data;
      }
      break;
    case 'hijack':
      if (isProduction && isLive) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useSubscription(HIJACK_SUB).data;
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useQuery(HIJACK_QUERY).data;
      }
      break;
    case 'bgpupdates':
      if (isProduction && isLive) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useSubscription(BGP_SUB).data;
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useQuery(BGP_QUERY).data;
      }
      break;
    case 'index_stats':
      if (isProduction && isLive) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useSubscription(INDEXSTATS_SUB).data;
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        data = useQuery(INDEXSTATS_QUERY).data;
      }
      break;
  }

  return data;
}
