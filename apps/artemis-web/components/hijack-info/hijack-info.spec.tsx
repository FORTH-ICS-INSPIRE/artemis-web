import { act, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { ContentState, EditorState } from 'draft-js';
import Enzyme, { shallow } from 'enzyme';
import { enableFetchMocks } from 'jest-fetch-mock';
import React from 'react';
import HijackInfoComponent from './hijack-info';

enableFetchMocks();

Enzyme.configure({ adapter: new Adapter() });

describe('HijackInfoComponent', () => {
  window.matchMedia = () => ({
    addListener: () => {
      return;
    },
    removeListener: () => {
      return;
    },
  });

  it('should render successfully', async () => {
    const mock = {
      classes: {
        paper: 'makeStyles-paper-10',
        avatar: 'makeStyles-avatar-11',
        form: 'makeStyles-form-12',
      },
      context: {
        tooltips: {},
        setTooltips: () => {
          return '';
        },
      },
      editorState: EditorState.createWithContent(
        ContentState.createFromText('')
      ),
      hijackDataState: { seen: false, resolved: false, ignored: false },
      hijackKey: '85db93fdcecb9a8ec81dcd9a4333bb92',
      setEditorState: () => {
        return '';
      },
      setOpenModalState: () => {
        return '';
      },
      setTooltips: () => {
        return '';
      },
      tooltips: {},
    };

    const promise = Promise.resolve();
    jest.fn(() => promise);


    fetch.mockResponse(JSON.stringify({
      "recordsTotal": 0,
    }));

    const element = shallow(<HijackInfoComponent {...mock} />);
    // const element = screen.getByText(/Hijack Information/i);
    expect(element.text()).toContain('Hijack Information');
    expect(element.text()).toContain('BGP Announcement');

    await act(() => promise);
  });
});