import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import Login from './login';
import React from 'react';

expect.extend(toHaveNoViolations);

describe('Login', () => {
  it('should render successfully', async () => {
    const { container } = render(<Login />);
    expect(container.querySelectorAll('#email')).toHaveLength(1);
    expect(container.querySelectorAll('#password')).toHaveLength(1);
    expect(container.querySelectorAll('[type="submit"]')).toHaveLength(1);
    const items = await screen.findAllByText(/Sign In/);
    expect(items).toHaveLength(1);
  });

  it('should have no accessibility violations', async () => {
    fetchPolyfill('');

    const { container } = render(
      <div role={'main'}>
        {' '}
        <Login />{' '}
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
