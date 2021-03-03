import React from 'react';
import { render } from '@testing-library/react';
import PasswordChangeComponent from './password-change';

describe('PasswordChange', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PasswordChangeComponent />);
    expect(baseElement).toBeTruthy();
  });
});
