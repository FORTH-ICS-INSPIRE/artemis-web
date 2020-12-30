import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import BGPTable from './bgp-table';
import { QueryGenerator } from '../../libs/graphql';

describe('BGPTable', () => {
  it('should render successfully', () => {
    const generator = new QueryGenerator('bgpUpdates', false, {});
    const mocks = [
      {
        request: {
          operationName: 'bgpupdates',
          query: generator.getQuery(),
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
    ];

    const { baseElement } = render(
      <MockedProvider mocks={mocks}>
        <BGPTable
          filter={0}
          isLive={false}
          setFilteredBgpData={(data) => {
            return;
          }}
        />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
