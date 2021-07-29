import React from 'react';
import Enzyme,{ shallow, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import SignUp from './sign-up';
import { Button, TextField } from '@material-ui/core';

Enzyme.configure({ adapter: new Adapter() });

describe('SignUp', () => {
  it('should render successfully', () => {
    const element = mount(<SignUp />);
    expect(element.text()).toContain('Sign Up');
    expect(element.find(TextField)).toHaveLength(3);
    expect(element.find(Button)).toHaveLength(1);

  });
});
