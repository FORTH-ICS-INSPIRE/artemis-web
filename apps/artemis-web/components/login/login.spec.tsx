import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { axe, toHaveNoViolations } from 'jest-axe';
import { fetch as fetchPolyfill } from 'whatwg-fetch';

import Login from './login';
import { Button, TextField } from '@material-ui/core';

Enzyme.configure({ adapter: new Adapter() });
expect.extend(toHaveNoViolations);

describe('Login', () => {
  it('should render successfully', () => {
    const element = mount(<Login />);
    expect(element.text()).toContain('Sign In');
    expect(element.find(TextField)).toHaveLength(2);
    expect(element.find(Button)).toHaveLength(2);
  });

  it('should have no accessibility violations', async () => {
    fetchPolyfill('');

    const html = mount(
      <div role={'main'}>
        {' '}
        <Login />{' '}
      </div>
    ).getDOMNode();
    const results = await axe(html);
    expect(results).toHaveNoViolations();
  });
});
