import React from 'react';
import { render } from '@testing-library/react';
import ModuleState from './module-state';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

describe('ModuleState', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <table>
        <tbody>
          <ModuleState />
        </tbody>
      </table>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const { baseElement } = render(<ModuleState />);
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });
});
