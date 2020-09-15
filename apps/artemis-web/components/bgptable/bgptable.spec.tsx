import React from 'react';
import { render } from '@testing-library/react';

import BGPTable from './bgptable';

describe('BGPTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BGPTable />);
    expect(baseElement).toBeTruthy();
  });
});
