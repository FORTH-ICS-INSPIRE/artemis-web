import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import HijackTable from './hijack-table';
import { gql } from '@apollo/client';

describe('HijackTable', () => {
  it('should render successfully', () => {
    const mocks = [
      {
        request: {
          operationName: 'hijacks',
          query: gql`
            query hijacks {
              view_hijacks {
                active
                comment
                configured_prefix
                hijack_as
                ignored
                dormant
                key
                rpki_status
                mitigation_started
                num_asns_inf
                num_peers_seen
                outdated
                peers_seen
                peers_withdrawn
                prefix
                resolved
                seen
                time_detected
                time_ended
                time_last
                time_started
                timestamp_of_config
                type
                under_mitigation
                withdrawn
              }
            }
          `,
        },
        result: {
          data: {
            view_hijacks: [
              {
                active: true,
                comment: '',
                configured_prefix: '139.0.0.0/10',
                hijack_as: 9905,
                ignored: false,
                dormant: false,
                key: '2964f00564f5f376567b3be09a7f0fa1',
                rpki_status: 'NA',
                mitigation_started: null,
                num_asns_inf: 119,
                num_peers_seen: 65,
                outdated: false,
                peers_seen: [
                  25091,
                  41095,
                  206356,
                  57111,
                  8218,
                  205344,
                  51873,
                  24482,
                  61218,
                  21412,
                  49697,
                  207910,
                  34854,
                  55720,
                  553,
                  35369,
                  9002,
                  206499,
                  42541,
                  48821,
                  50869,
                  34872,
                  58299,
                  36924,
                  6720,
                  137409,
                  23106,
                  263237,
                  139589,
                  44103,
                  45896,
                  208709,
                  51786,
                  15562,
                  207564,
                  57164,
                  47692,
                  2895,
                  209102,
                  58057,
                  63956,
                  43607,
                  49752,
                  6233,
                  26073,
                  133210,
                  37721,
                  56665,
                  393950,
                  57695,
                  35426,
                  199524,
                  44393,
                  8426,
                  12779,
                  48362,
                  206313,
                  49134,
                  34927,
                  51184,
                  38001,
                  6894,
                  208627,
                  37239,
                  41722,
                ],
                peers_withdrawn: [45896],
                prefix: '139.0.24.0/21',
                resolved: false,
                seen: false,
                time_detected: '2020-12-16T16:05:01.967769',
                time_ended: null,
                time_last: '2020-12-23T13:06:07.000003',
                time_started: '2020-12-16T16:04:53.000042',
                timestamp_of_config: '2020-12-16T15:59:47.407108',
                type: 'S|0|-|-',
                under_mitigation: false,
                withdrawn: false,
                __typename: 'view_hijacks',
              },
            ],
          },
        },
      },
      {
        request: {
          operationName: 'getLiveTableCount',
          query: gql`
            query getLiveTableCount {
              count_data: view_hijacks_aggregate(
                where: {
                  _and: [
                    { time_last: { _gte: "2021-01-25T08:24:22.385Z" } }
                    { time_last: { _lte: "2021-01-25T08:24:00.000Z" } }
                  ]
                }
              ) {
                aggregate {
                  count
                  __typename
                }
                __typename
              }
            }
          `,
          variables: {},
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
    const { baseElement } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <HijackTable />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
