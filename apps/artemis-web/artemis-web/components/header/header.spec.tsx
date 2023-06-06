import React from 'react';
import DesktopHeader from '../desktop-header/desktop-header';
import { render, screen } from '@testing-library/react';

describe('Header', () => {
  it('should render the login and create account options if not logged in', async () => {
    const { container } = render(<DesktopHeader />);
    expect(container.querySelectorAll('li')).toHaveLength(3);
    const items = await screen.findAllByText(/Create Account/);
    expect(items).toHaveLength(1);
  });
});
