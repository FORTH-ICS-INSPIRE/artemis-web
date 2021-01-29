import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Switch,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { ContentState, Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { animated, useTransition } from 'react-spring';
import 'react-toastify/dist/ReactToastify.css';
import AuthHOC from '../components/401-hoc/401-hoc';
import BGPTableComponent from '../components/bgp-table/bgp-table';
import LearnRuleComponent from '../components/learn-rule/learn-rule';
import Tooltip from '../components/tooltip/tooltip';
import TooltipContext from '../context/tooltip-context';
import { sendData, submitComment } from '../utils/fetch-data';
import { useGraphQl } from '../utils/hooks/use-graphql';
import { extractHijackInfos } from '../utils/parsers';
import { useStyles } from '../utils/styles';
import { findStatus, shallSubscribe, statuses } from '../utils/token';

const ViewHijackPage = (props) => {
  const [isLive, setIsLive] = useState(true);
  const [tooltips, setTooltips] = useState({});
  const context = React.useContext(TooltipContext);

  // if (shallMock()) {
  //   // eslint-disable-next-line @typescript-eslint/no-var-requires
  //   const { worker } = require('../utils/mock-sw/browser');
  //   worker.start();
  // }

  const classes = useStyles();
  const router = useRouter();

  const hijackKey: string = router.query.key.toString() ?? '';
  if (!hijackKey.length) router.push('/wronghijackkey');

  const user = props.user;

  const [distinctValues, setDistinctValues] = useState([]);
  const [selectState, setSelectState] = useState('');
  const [seenState, setSeenState] = useState(false);
  const [withdrawState, setWithdrawState] = useState(false);
  const [hijackDataState, setHijackDataState] = useState({
    peers_seen: [],
    peers_withdrawn: [],
    comment: '',
    seen: false,
    resolved: false,
    ignored: false,
    prefix: '',
  });
  const [hijackExists, setHijackExists] = useState(true);
  const [filteredBgpData, setFilteredBgpData] = useState([]);
  const [editComment, setEditComment] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      ContentState.createFromText(hijackDataState.comment)
    )
  );
  const seenTransitions = useTransition(seenState, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  const withdrawnTransitions = useTransition(withdrawState, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const [selectActionState, setSelectActionState] = useState(
    'hijack_action_resolve'
  );
  const [openModalState, setOpenModalState] = useState(false);

  const commentRef = React.createRef();

  useGraphQl('hijackByKey', {
    callback: (data) => {
      const hijacks = data.view_hijacks;

      if (hijacks.length === 0) {
        setHijackExists(false);
        return;
      }
      setHijackDataState(hijacks[0]);
      setEditorState(() =>
        EditorState.createWithContent(
          ContentState.createFromText(hijacks[0].comment)
        )
      );
    },
    isLive: false,
    key: hijackKey,
    sortOrder: 'desc',
    sortColumn: 'time_last',
    hasDateFilter: false,
    hasColumnFilter: false,
    hasStatusFilter: false,
  });

  if (!hijackExists) router.push('/wronghijackkey');
  const seen = hijackDataState ? hijackDataState.peers_seen ?? [] : [];
  const withdrawn = hijackDataState
    ? hijackDataState.peers_withdrawn ?? []
    : [];
  const resolved = hijackDataState?.resolved;
  const ignored = hijackDataState?.ignored;

  const onChangeValue = (event) => {
    setSelectState(event.target.value);

    setDistinctValues(
      filteredBgpData
        .map((entry) => {
          return entry[event.target.value];
        })
        .filter((v, i, a) => a.indexOf(v) === i)
    );
  };

  const [hijackInfoLeft, hijackInfoRight] = extractHijackInfos(
    hijackDataState,
    {
      tooltips: tooltips,
      setTooltips: setTooltips,
      context: context,
    }
  );

  const config = useGraphQl('config', {
    isLive: false,
    hasDateFilter: false,
    hasColumnFilter: false,
    hasStatusFilter: false,
  });

  return (
    <>
      <Head>
        <title>ARTEMIS - Hijack</title>
      </Head>
      {user && hijackExists && (
        <div
          className="container overview col-lg-12"
          style={{ paddingTop: '120px' }}
        >
          <div className="row">
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="row">
                <div className="col-lg-8" style={{ color: 'white' }}>
                  <h1>
                    Viewing Hijack
                    <small id="hijack_status">
                      {findStatus(hijackDataState).map((status, i) => (
                        <span
                          key={i}
                          style={{ marginLeft: '10px' }}
                          className={
                            'badge badge-pill badge-' + statuses[status]
                          }
                        >
                          {status}
                        </span>
                      ))}
                    </small>
                  </h1>
                </div>
                <div className="col-lg-1"></div>
                <div className="col-lg-2">
                  <h2 style={{ color: 'white' }}> Live Updates </h2>{' '}
                </div>
                <div className="col-lg-1">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={() => {
                            setIsLive(!isLive);
                          }}
                          size="medium"
                          checked={isLive}
                        />
                      }
                      label=""
                    />
                  </FormGroup>
                </div>
                <hr style={{ backgroundColor: 'white' }} />
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-lg-1" />
            <div className="col-lg-7">
              <div className="card">
                <div className="card-header">
                  Hijack Information
                  {hijackDataState && hijackDataState.seen ? (
                    <span
                      id="hijack_acknowledged_badge"
                      className="badge badge-acknowledged float-right badge-primary"
                    >
                      Acknowledged
                    </span>
                  ) : (
                      <span
                        id="hijack_acknowledged_badge"
                        className="badge badge-acknowledged float-right badge-danger"
                      >
                        Not Acknowledged
                      </span>
                    )}
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6">
                      {Object.keys(hijackInfoLeft).map((key) => {
                        return (
                          <div key={key} className="row">
                            <div
                              className="col-lg-4"
                              style={{ fontWeight: 'bold' }}
                            >
                              {hijackInfoLeft[key][1]}
                            </div>
                            <div className="col-lg-8">
                              {typeof hijackInfoLeft[key][0] !== 'object' ? (
                                <input
                                  id="info_type"
                                  className="form-control"
                                  type="text"
                                  readOnly={true}
                                  value={hijackInfoLeft[key][0] ?? ''}
                                />
                              ) : (
                                  hijackInfoLeft[key][0] ?? ''
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="col-lg-6">
                      {Object.keys(hijackInfoRight).map((key) => {
                        return (
                          <div key={key} className="row">
                            <div
                              className="col-lg-4"
                              style={{ fontWeight: 'bold' }}
                            >
                              {hijackInfoRight[key][1] ?? ''}
                            </div>
                            <div className="col-lg-8">
                              {typeof hijackInfoRight[key][0] !== 'object' ? (
                                <input
                                  id="info_type"
                                  className="form-control"
                                  type="text"
                                  readOnly={true}
                                  value={hijackInfoRight[key][0] ?? ''}
                                />
                              ) : (
                                  hijackInfoRight[key][0] ?? ''
                                )}
                            </div>
                          </div>
                        );
                      })}
                      <div className="row" style={{ marginTop: '20px' }}>
                        <div className="col-lg-4">
                          <button
                            onClick={() => setSeenState(!seenState)}
                            className="btn btn-info"
                            type="button"
                            data-toggle="collapse"
                            data-target="#seenHijackUpdate"
                            aria-expanded="false"
                            aria-controls="seenHijackUpdate"
                          >
                            BGP Announcement
                          </button>
                        </div>
                        <div className="col-lg-8">
                          <button
                            onClick={() => setWithdrawState(!withdrawState)}
                            className="btn btn-info"
                            type="button"
                            data-toggle="collapse"
                            data-target="#seenHijackWithdraw"
                            aria-expanded="false"
                            aria-controls="seenHijackWithdraw"
                          >
                            BGP Withdrawal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="row" style={{ marginBottom: '15px' }}>
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">Hijack Actions</div>
                    <div className="card-body">
                      <select
                        onChange={(e) => setSelectActionState(e.target.value)}
                        style={{
                          width: '200px',
                          display: 'inline-block',
                          marginRight: '15px',
                        }}
                        className="form-control form-control-sm-auto"
                        id="action_selection"
                      >
                        {!resolved && !ignored && (
                          <option value="hijack_action_resolve">
                            Mark as Resolved
                          </option>
                        )}
                        {!resolved && !ignored && (
                          <option value="hijack_action_ignore">
                            Mark as Ignored
                          </option>
                        )}
                        {!seen && (
                          <option value="hijack_action_acknowledge">
                            Mark as Acknowledged
                          </option>
                        )}
                        {seen && (
                          <option value="hijack_action_acknowledge_not">
                            Mark as Not Acknowledged
                          </option>
                        )}
                        <option value="hijack_action_delete">
                          Delete Hijack
                        </option>
                      </select>
                      <button
                        onClick={(e) =>
                          selectActionState === 'hijack_action_ignore'
                            ? setOpenModalState(true)
                            : sendData(e, {
                              hijackKeys: [hijackKey],
                              selectState: selectActionState,
                            })
                        }
                        style={{ marginRight: '5px' }}
                        id="apply_selected"
                        type="button"
                        className="btn btn-primary btn-md"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      Comments{' '}
                      <button
                        style={{ marginRight: '5px', float: 'right' }}
                        id="edit_comment"
                        type="button"
                        className={`btn btn-${!editComment ? 'primary' : 'secondary'
                          } btn-md`}
                        onClick={(e) => {
                          if (editComment)
                            submitComment(e, { commentRef, hijackKey });
                          setEditComment(!editComment);
                        }}
                      >
                        {!editComment ? 'Edit' : 'Save'}
                      </button>
                    </div>
                    <div className="card-body">
                      <Editor
                        ref={commentRef}
                        readOnly={!editComment}
                        editorState={editorState}
                        onChange={setEditorState}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6">
                      {seenState && (
                        <div className="card">
                          {seenTransitions.map(({ item, key, props }) =>
                            item ? (
                              <animated.div
                                key={key}
                                style={props}
                                className={
                                  'card-header multi-collapse collapse show'
                                }
                              >
                                Peers Seen Hijack BGP Announcement:
                                <Grid container spacing={3}>
                                  {seen.map((value, i) => {
                                    const asn = value;
                                    if (value !== undefined)
                                      return (
                                        <Grid key={i} item xs={3}>
                                          <Paper className={classes.paper}>
                                            <Tooltip
                                              tooltips={tooltips}
                                              setTooltips={setTooltips}
                                              asn={asn}
                                              label={`seen${i}`}
                                              context={context}
                                            />
                                          </Paper>
                                        </Grid>
                                      );
                                    else return <> </>;
                                  })}
                                </Grid>
                              </animated.div>
                            ) : (
                                <animated.div key={key}></animated.div>
                              )
                          )}
                        </div>
                      )}
                    </div>
                    <div className="col-lg-6">
                      {withdrawState && (
                        <div className="card" style={{ borderTop: '0px' }}>
                          {withdrawnTransitions.map(({ item, key, props }) =>
                            item ? (
                              <animated.div
                                key={key}
                                style={{ ...props, borderTop: '0px' }}
                                className={
                                  'card-header multi-collapse collapse show'
                                }
                              >
                                Peers Seen Hijack BGP Withdrawal:
                                <Grid container spacing={3}>
                                  {withdrawn.map((value, i) => {
                                    const asn = value;
                                    if (value !== undefined)
                                      return (
                                        <Grid key={i} item xs={3}>
                                          <Paper className={classes.paper}>
                                            <Tooltip
                                              tooltips={tooltips}
                                              setTooltips={setTooltips}
                                              asn={asn}
                                              label={`withdrawn${i}`}
                                              context={context}
                                            />
                                          </Paper>
                                        </Grid>
                                      );
                                    else return <> </>;
                                  })}
                                </Grid>
                              </animated.div>
                            ) : (
                                <animated.div key={key}></animated.div>
                              )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="card">
                <div className="card-header">Related BGP Updates</div>
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <Dialog
                    aria-labelledby="customized-dialog-title"
                    open={openModalState}
                  >
                    <DialogTitle id="customized-dialog-title">
                      Configuration diff (Learn new rule)
                      <IconButton
                        style={{ float: 'right' }}
                        aria-label="close"
                        onClick={() => setOpenModalState(false)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                      <div id="modal_display_config_comparison">
                        <div id="modal_display_config_comparison">
                          <LearnRuleComponent
                            hijack={hijackDataState}
                            config={config}
                          />
                        </div>
                      </div>
                    </DialogContent>
                    {/* <DialogActions>
                      <DialogActions>
                        <Button color="primary">
                          Add rule
                        </Button>
                        <Button color="secondary">
                          Procceed with no change
                        </Button>
                      </DialogActions>
                    </DialogActions> */}
                  </Dialog>
                  <BGPTableComponent
                    filter={0}
                    isLive={isLive}
                    setFilteredBgpData={setFilteredBgpData}
                    hijackKey={hijackKey}
                    skippedCols={['as_path', 'hijack_key']}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="card">
                <div className="card-header"> View distinct values </div>
                <div className="card-body">
                  <div className="col-lg-3">
                    <select
                      className="form-control"
                      id="distinct_values_selection"
                      value={selectState}
                      onChange={onChangeValue.bind(this)}
                    >
                      <option value="select">Select</option>
                      <option value="origin_as">Origin AS</option>
                      <option value="peer_asn">Peer AS</option>
                      <option value="service">Service</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <Grid container spacing={3}>
                    {filteredBgpData &&
                      distinctValues.map((value, i) => {
                        if (value !== undefined) {
                          const asn = value;
                          if (
                            selectState === 'origin_as' ||
                            selectState === 'peer_asn'
                          )
                            value = (
                              <div key={i}>
                                <Tooltip
                                  tooltips={tooltips}
                                  setTooltips={setTooltips}
                                  asn={asn}
                                  label={`originD${i}`}
                                  context={context}
                                />
                              </div>
                            );
                          return (
                            <Grid key={i} item xs>
                              <Paper className={classes.paper}>{value}</Paper>
                            </Grid>
                          );
                        } else return <> </>;
                      })}
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {user && !hijackExists && (
        <DefaultErrorPage
          statusCode={404}
          title={'This hijack does not exist'}
        />
      )}
    </>
  );
};

export default AuthHOC(ViewHijackPage, ['admin', 'user']);
