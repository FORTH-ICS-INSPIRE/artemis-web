import React from 'react';
import { render } from '@testing-library/react';

import UserListComponent from './user-list';

describe('UserList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UserListComponent data={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
