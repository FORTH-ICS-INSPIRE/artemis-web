import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import UserListComponent from './user-list';

Enzyme.configure({ adapter: new Adapter() });


describe('UserList', () => {
  it('should render successfully', () => {
    const element = mount(<UserListComponent data={[{
      _id: 1,
      name: 'test',
      email: 'test@test.com',
      role: 'user',
      lastLogin: ''
    }]} />);

    expect(element.text()).toContain('test@test.com');
  });
});
