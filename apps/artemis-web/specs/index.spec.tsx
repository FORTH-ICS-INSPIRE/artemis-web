import React from 'react';
import { render } from '@testing-library/react';
import HomePage from '../pages/index';

require('jest-fetch-mock').enableMocks();

describe('Index', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HomePage />);
    expect(baseElement).toBeTruthy();
  });
});
