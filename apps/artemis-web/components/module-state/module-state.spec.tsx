import React from 'react';
import { render } from '@testing-library/react';

import ModuleState from './module-state';

describe('ModuleState', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ModuleState />);
    expect(baseElement).toBeTruthy();
  });
});
