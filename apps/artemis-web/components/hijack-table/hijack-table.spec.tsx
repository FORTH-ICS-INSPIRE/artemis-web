import React from 'react';
import { render } from '@testing-library/react';

import HijackTable from './hijack-table';

describe('HijackTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HijackTable />);
    expect(baseElement).toBeTruthy();
  });
});
