import React from 'react';
import { render } from '@testing-library/react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from './header';
import Link from 'next/link';

configure({ adapter: new Adapter() });

describe('Header', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Header />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the login, create account if logged in', () => {
    const wrapper = shallow(<Header loggedIn={false} />);
    expect(wrapper.find(Link)).toHaveLength(2);
  });

  it('should render the overview, bgp updates, hijack pages, logout if logged in', () => {
    const wrapper = shallow(<Header loggedIn={true} />);
    expect(wrapper.find(Link)).toHaveLength(3);
  });
});
