import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import OngoingHijackTable from './ongoing-hijack-table';
import { QueryGenerator } from '../../libs/graphql';

describe('OngoingHijackTable', () => {
  it('should render successfully', () => {
    const generator = new QueryGenerator('hijacks', false, {});
    const generator2 = new QueryGenerator('hijackCount', false, {});

    const mocks = [
      {
        request: {
          operationName: 'hijacks',
          query: generator.getQuery(),
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
    const { baseElement } = render(
      <MockedProvider mocks={mocks}>
        <OngoingHijackTable isLive={false} />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
