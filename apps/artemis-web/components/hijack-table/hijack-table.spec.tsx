import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import HijackTable from './hijack-table';

describe('HijackTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <HijackTable />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
