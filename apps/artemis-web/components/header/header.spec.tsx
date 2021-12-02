import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import DesktopHeader from '../desktop-header/desktop-header';

configure({ adapter: new Adapter() });

describe('Header', () => {
  it('should render the login and create account options if not logged in', async () => {
    const wrapper = shallow(<DesktopHeader />);
    expect(wrapper.find('li')).toHaveLength(3);
    expect(wrapper.text()).toContain('Create Account');
  });
});
