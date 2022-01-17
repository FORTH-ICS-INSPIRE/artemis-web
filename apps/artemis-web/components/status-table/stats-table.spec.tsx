import React from 'react';
import { render } from '@testing-library/react';
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import { axe, toHaveNoViolations } from 'jest-axe';

import StatusTable from './status-table';

expect.extend(toHaveNoViolations);

describe('StatsTable', () => {
  it('should render successfully', () => {
    fetchPolyfill('');

    const { baseElement } = render(
      <StatusTable
        data={{
          view_processes: [
            { name: 'test', running: true, timestamp: Date.now() },
          ],
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    fetchPolyfill('');

    const { baseElement } = render(
      <StatusTable
        data={{
          view_processes: [
            { name: 'test', running: true, timestamp: Date.now() },
          ],
        }}
      />
    );
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });
});
