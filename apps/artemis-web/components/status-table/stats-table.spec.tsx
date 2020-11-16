import React from 'react';
import { render } from '@testing-library/react';

import StatsTable from './status-table';

describe('StatsTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <StatsTable
        data={{
          view_processes: [
            { name: 'test', running: true, timestamp: Date.now() },
          ],
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
