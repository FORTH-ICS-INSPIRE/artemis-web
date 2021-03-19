import React from 'react';
import { act, render } from '@testing-library/react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from './header';
import DesktopHeader from '../desktop-header/desktop-header';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

configure({ adapter: new Adapter() });

describe('Header', () => {
  window.matchMedia = () => ({
    addListener: () => {
      return;
    },
    removeListener: () => {
      return;
    },
  });

  it('should render successfully', async () => {
    const promise = Promise.resolve();
    jest.fn(() => promise);
    const { baseElement } = render(<Header />);
    expect(baseElement).toBeTruthy();

    await act(() => promise);
  });

  it('should render the login and create account options if not logged in', async () => {
    const promise = Promise.resolve();
    jest.fn(() => promise);
    const wrapper = shallow(<DesktopHeader />);
    expect(wrapper.find('li')).toHaveLength(3);
    await act(() => promise);
  });
});
