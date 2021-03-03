import React from 'react';
import { act, render } from '@testing-library/react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HijackAS from './hijack-as';
import DesktopHeader from '../desktop-header/desktop-header';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

configure({ adapter: new Adapter() });

describe('HijackAS', () => {
  // window.matchMedia = () => ({
  //   addListener: () => {
  //     return;
  //   },
  //   removeListener: () => {
  //     return;
  //   },
  // });

  it('should render successfully', async () => {
    // const promise = Promise.resolve();
    // jest.fn(() => promise);
    // const { baseElement } = render(<HijackAS />);
    // expect(baseElement).toBeTruthy();

    // await act(() => promise);
  });
});
