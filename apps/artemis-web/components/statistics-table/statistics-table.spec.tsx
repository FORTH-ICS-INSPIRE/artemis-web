import React from 'react';
import { render } from '@testing-library/react';

import StatsTable from './statistics-table';

describe('StatisticsTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <StatsTable
        data={{
          view_index_all_stats: [{}],
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
