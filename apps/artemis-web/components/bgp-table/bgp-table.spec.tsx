import React from 'react';
import { render } from '@testing-library/react';

import BGPTable from './bgp-table';

describe('BGPTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BGPTable data={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
