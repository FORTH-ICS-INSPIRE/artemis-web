import React from 'react';
import { act, render } from '@testing-library/react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from './header';
import Link from 'next/link';
require('jest-fetch-mock').enableMocks();

configure({ adapter: new Adapter() });

describe('Header', () => {
  it('should render successfully', async () => {
    const promise = Promise.resolve();
    const handle = jest.fn(() => promise);
    const { baseElement } = render(<Header />);
    expect(baseElement).toBeTruthy();

    await act(() => promise);
  });

  it('should render the login and create account options if not logged in', async () => {
    const promise = Promise.resolve();
    const handle = jest.fn(() => promise);
    const wrapper = shallow(<Header />);
    expect(wrapper.find(Link)).toHaveLength(2);
    await act(() => promise);
  });
});
