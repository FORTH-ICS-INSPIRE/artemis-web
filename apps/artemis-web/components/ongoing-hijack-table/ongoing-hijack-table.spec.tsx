import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import OngoingHijackTable from './ongoing-hijack-table';

describe('OngoingHijackTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <OngoingHijackTable isLive={false} />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
