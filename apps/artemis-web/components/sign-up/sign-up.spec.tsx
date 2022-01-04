import React from 'react';
import { render } from '@testing-library/react';
import { fetch as fetchPolyfill } from 'whatwg-fetch'
import SignUp from './sign-up';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

describe('SignUp', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SignUp />);
    expect(baseElement).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    fetchPolyfill('');

    const { baseElement } = render(<div role={"main"}><SignUp /></div>);
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });
});
