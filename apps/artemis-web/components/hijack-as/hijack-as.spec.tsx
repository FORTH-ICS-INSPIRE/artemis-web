import React from 'react';
import { act, render } from '@testing-library/react';
import HijackAS from './hijack-as';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

describe('HijackAS', () => {
  window.matchMedia = () => ({
    addListener: () => {
      return;
    },
    removeListener: () => {
      return;
    },
  });

  it('should render successfully', async () => {
    const promise = Promise.resolve();
    jest.fn(() => promise);
    const { baseElement } = render(<HijackAS />);
    expect(baseElement).toBeTruthy();

    await act(() => promise);
  });
});
