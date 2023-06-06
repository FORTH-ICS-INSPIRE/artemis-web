import React from 'react';
import { act, render } from '@testing-library/react';
import HomePage from '../pages/index';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

describe('Index', () => {
  it('should render successfully', async () => {
    const promise = Promise.resolve();
    jest.fn(() => promise);
    const { baseElement } = render(<HomePage />);
    expect(baseElement).toBeTruthy();

    await act(() => promise);
  });
});
