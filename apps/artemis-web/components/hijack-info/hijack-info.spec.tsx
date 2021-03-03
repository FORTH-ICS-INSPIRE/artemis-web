import React, { useState } from 'react';
import { act, render } from '@testing-library/react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HijackInfoComponent from './hijack-info';
import DesktopHeader from '../desktop-header/desktop-header';
import { enableFetchMocks } from 'jest-fetch-mock';
import { ContentState, Editor, EditorState } from 'draft-js';

enableFetchMocks();

configure({ adapter: new Adapter() });

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
    const { baseElement } = render(<HijackInfoComponent {...mock} />);
    expect(baseElement).toBeTruthy();

    await act(() => promise);
  });
});
