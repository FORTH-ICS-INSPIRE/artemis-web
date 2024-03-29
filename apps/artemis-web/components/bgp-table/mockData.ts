import { QueryGenerator } from '../../libs/graphql';
import { gql } from '@apollo/client';

const generator2 = new QueryGenerator('bgpCount', false, {});
export const mocks = [
  {
    request: {
      operationName: 'bgpupdates',
      query: gql`
        query bgpupdates($offset: Int!, $limit: Int!) {
          view_bgpupdates(
            limit: $limit
            offset: $offset
            order_by: { timestamp: desc }
          ) {
            prefix
            origin_as
            peer_asn
            as_path
            service
            type
            communities
            timestamp
            hijack_key
            handled
            matched_prefix
            orig_path
            __typename
          }
        }
      `,
      variables: { offset: 0, limit: 10 },
    },
    result: {
      data: {
        view_bgpupdates: [
          {
            prefix: '192.67.249.0/24',
            origin_as: 8522,
            peer_asn: 208627,
            as_path: [208627, 43350, 21320, 5408, 8522],
            service: 'ripe-ris|rrc03',
            type: 'A',
            communities: [],
            timestamp: new Date(),
            hijack_key: [],
            handled: true,
            matched_prefix: '192.67.249.0/24',
            orig_path: null,
          },
        ],
      },
    },
  },
  {
    request: {
      operationName: 'getLiveTableCount',
      query: generator2.getQuery(),
    },
    result: {
      data: {
        count_data: {
          aggregate: {
            count: 25,
            __typename: 'view_hijacks_aggregate_fields',
          },
          __typename: 'view_hijacks_aggregate',
        },
      },
    },
  },
];
