import { act, render, screen } from '@testing-library/react';
import { ContentState, EditorState } from 'draft-js';
import { enableFetchMocks } from 'jest-fetch-mock';
import React from 'react';
import HijackInfoComponent from './hijack-info';

enableFetchMocks();

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

    fetch.mockResponse(
      JSON.stringify({
        recordsTotal: 0,
      })
    );

    render(<HijackInfoComponent {...mock} />);
    let items = await screen.findAllByText(/Hijack Information/);
    expect(items).toHaveLength(1);
    items = await screen.findAllByText(/BGP Announcement/);
    expect(items).toHaveLength(1);

    await act(() => promise);
  });
});
