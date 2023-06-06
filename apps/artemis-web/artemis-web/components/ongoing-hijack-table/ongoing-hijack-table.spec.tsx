import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import React from 'react';
import OngoingHijackTable from './ongoing-hijack-table';
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import { axe, toHaveNoViolations } from 'jest-axe';
import { mocks } from './mockData';

expect.extend(toHaveNoViolations);

describe('OngoingHijackTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <OngoingHijackTable isLive={false} />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    fetchPolyfill('');

    const { baseElement } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <OngoingHijackTable isLive={false} />
      </MockedProvider>
    );
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });
});
