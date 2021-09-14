import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import Login from './login';
import { Button, TextField } from '@material-ui/core';

Enzyme.configure({ adapter: new Adapter() });

describe('Login', () => {
  it('should render successfully', () => {
    const element = mount(<Login />);
    expect(element.text()).toContain('Sign In');
    expect(element.find(TextField)).toHaveLength(2);
    expect(element.find(Button)).toHaveLength(2);
  });
});
