import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import BGPTable from './bgp-table';
import { mocks } from './mockData';

describe('BGPTable', () => {
  it('should render successfully', () => {
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
