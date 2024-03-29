import TooltipContext from '../../context/tooltip-context';
import { useState } from 'react';
import React from 'react';
import { useStyles } from '../styles';
import { useTransition } from 'react-spring';
import { useGraphQl } from './use-graphql';
import { ContentState, Editor, EditorState } from 'draft-js';

export const useHijack = () => {
  const [isLive, setIsLive] = useState(true);
  const [tooltips, setTooltips] = useState({});
  const context = React.useContext(TooltipContext);
  const classes = useStyles();

  const [distinctValues, setDistinctValues] = useState([]);
  const [selectState, setSelectState] = useState('');
  const [hijackDataState, setHijackDataState] = useState({
    peers_seen: [],
    peers_withdrawn: [],
    comment: '',
    seen: false,
    resolved: false,
    ignored: false,
    prefix: '',
    hijack_as: '',
    type: '',
    under_mitigation: false,
  });
  const [hijackExists, setHijackExists] = useState(true);
  const [filteredBgpData, setFilteredBgpData] = useState([]);
  const [editComment, setEditComment] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      ContentState.createFromText(hijackDataState.comment)
    )
  );

  const [openModalState, setOpenModalState] = useState(false);

  const config = useGraphQl('config', {
    isLive: false,
    hasDateFilter: false,
    hasColumnFilter: false,
    hasStatusFilter: false,
  });

  return {
    isLive,
    setIsLive,
    tooltips,
    setTooltips,
    context,
    classes,
    distinctValues,
    setDistinctValues,
    selectState,
    setSelectState,
    hijackDataState,
    setHijackDataState,
    hijackExists,
    setHijackExists,
    filteredBgpData,
    setFilteredBgpData,
    editComment,
    setEditComment,
    editorState,
    setEditorState,
    openModalState,
    setOpenModalState,
    config,
  };
};
