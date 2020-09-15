import React from 'react';
import { render } from '@testing-library/react';

import OngoingHijackTable from './ongoing-hijack-table';

describe('OngoingHijackTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OngoingHijackTable />);
    expect(baseElement).toBeTruthy();
  });
});
