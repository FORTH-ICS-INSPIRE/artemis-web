import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Footer', () => {
  it('should render successfully', async () => {
    render(<Footer system_version={'2.0.0'} />);
    const items = await screen.findAllByText(/ARTEMIS v.'2.0.0@HEAD'/);
    expect(items).toHaveLength(1);
  });
});
