import React from 'react';
import { render } from '@testing-library/react';
import ConfigComparisonComponent from './config-comparison';

describe('ConfigComparisonComponent', () => {
  it('should render successfully', () => {
    document.createRange = () => {
      const range = new Range();

      range.getBoundingClientRect = jest.fn();

      range.getClientRects = jest.fn(() => ({
        item: () => null,
        length: 0,
      }));

      return range;
    };
    const { baseElement } = render(<ConfigComparisonComponent />);
    expect(baseElement).toBeTruthy();
  });
});
