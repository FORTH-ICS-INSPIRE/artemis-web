import React from 'react';
import { render } from '@testing-library/react';

import StatsTable from './statistics-table';

import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

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

  it('should have no accessibility violations', async () => {
    const { baseElement } = render(<StatsTable
      data={{
        view_index_all_stats: [{}],
      }}
    />);
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });
});
