import React from 'react';
import { act, render } from '@testing-library/react';
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Header from './header';
import DesktopHeader from '../desktop-header/desktop-header';
import { enableFetchMocks } from 'jest-fetch-mock';

configure({ adapter: new Adapter() });

describe('Header', () => {
  it('should render the login and create account options if not logged in', async () => {
    const wrapper = shallow(<DesktopHeader />);
    expect(wrapper.find('li')).toHaveLength(3);
    expect(wrapper.text()).toContain('Create Account');
  });
});
