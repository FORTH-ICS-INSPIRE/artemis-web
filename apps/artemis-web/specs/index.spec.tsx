import React from 'react';
import { act, render } from '@testing-library/react';
import HomePage from '../pages/index';

require('jest-fetch-mock').enableMocks();

describe('Index', () => {
  it('should render successfully', async () => {
    const promise = Promise.resolve();
    jest.fn(() => promise);
    const { baseElement } = render(<HomePage />);
    expect(baseElement).toBeTruthy();

    await act(() => promise);
  });
});
