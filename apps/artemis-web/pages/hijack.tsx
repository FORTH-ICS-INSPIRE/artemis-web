import {
  FormControlLabel,
  FormGroup,
  Grid,
  makeStyles,
  Paper,
  Switch,
} from '@material-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import NotFoundHOC from '../components/404-hoc/404-hoc';
import BGPTableComponent from '../components/bgp-table/bgp-table';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useGraphQl } from '../utils/hooks/use-graphql';
import { formatDate, fromEntries } from '../utils/token';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const ViewHijackPage = (props) => {
  const [isLive, setIsLive] = useState(true);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isBrowser = typeof window !== 'undefined';

  if (isDevelopment && isBrowser) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }

  const statuses = {
    Ongoing: 'danger',
    Dormant: 'secondary',
    Resolved: 'success',
    Ignored: 'warning',
    'Under Mitigation': 'primary',
    Withdrawn: 'info',
    Outdated: 'dark',
  };

  const findStatus = (row) => {
    const statuses = [];

    if (row.withdrawn) statuses.push('Withdrawn');
    if (row.resolved) statuses.push('Resolved');
    if (row.ignored) statuses.push('Ignored');
    if (row.active) statuses.push('Active');
    if (row.dormant) statuses.push('Dormant');
    if (row.under_mitigation) statuses.push('Under Mitigation');
    if (row.outdated) statuses.push('Outdated');

    return statuses;
  };

  const classes = useStyles();
  const router = useRouter();
  const key: string = props.key ?? router.query.key ?? '';
  const user = props.user;

  const [distinctValues, setDistinctValues] = useState([]);
  const [selectState, setSelectState] = useState('');
  const [seenState, setSeenState] = useState(false);
  const [withdrawState, setWithdrawState] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const HIJACK_DATA = useGraphQl('hijackByKey', isLive, key);

  const BGP_DATA = useGraphQl('bgpByKey', isLive, key);
  const hijack = HIJACK_DATA ? HIJACK_DATA.view_hijacks[0] : [];
  let bgp = BGP_DATA ? BGP_DATA.view_data : [];

  bgp = bgp.map((row) =>
    fromEntries(
      Object.entries(row).map(([key, value]: [string, any]) => {
        if (key === 'timestamp') return [key, formatDate(new Date(value))];
        else if (key === 'service') return [key, value.replace(/\|/g, ' -> ')];
        else if (key === 'handled')
          return [
            key,
            value ? <img src="handled.png" /> : <img src="./unhadled.png" />,
          ];
        else return [key, value];
      })
    )
  );

  const seen = hijack ? hijack.peers_seen ?? [] : [];
  const withdrawn = hijack ? hijack.peers_withdrawn ?? [] : [];

  const onChangeValue = (event) => {
    setSelectState(event.target.value);

    setDistinctValues(
      bgp.map((entry) => {
        return entry[event.target.value];
      })
    );
  };

  const hijackInfo = {
    'Hijacker AS': hijack.hijack_as,
    Type: hijack.type,
    '# Peers Seen': hijack.num_peers_seen,
    '# ASes Infected': hijack.num_asns_inf,
    Prefix: hijack.prefix,
    Matched: hijack.configured_prefix,
    Config: formatDate(new Date(hijack.timestamp_of_config)),
    Key: hijack.key,
  };

  const hijackInfo2 = {
    'Time Started': formatDate(new Date(hijack.time_started)),
    'Time Detected': formatDate(new Date(hijack.time_detected)),
    'Last Update': formatDate(new Date(hijack.time_last)),
    'Time Ended': formatDate(new Date(hijack.time_ended)),
    'Mitigation Started': hijack.mitigation_started ?? 'Never',
    'Community Annotation': hijack.community_annotation,
    'RPKI Status': hijack.rpki_status,
    'Display Peers Seen Hijack': hijack.peers_seen,
  };

  return (
    <>
      <Head>
        <title>ARTEMIS - Hijack</title>
      </Head>
      {user && (
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
                      {findStatus(hijack).map((status) => (
                        <span
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
                  <h2 style={{ color: 'white' }}>Live Updates </h2>{' '}
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
                <div className="card-header">Hijack Information</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6">
                      {Object.keys(hijackInfo).map((key) => {
                        return (
                          <div className="row">
                            <div
                              className="col-lg-4"
                              style={{ fontWeight: 'bold' }}
                            >
                              {key}:
                            </div>
                            <div className="col-lg-8">
                              <input
                                id="info_type"
                                className="form-control"
                                type="text"
                                readOnly={true}
                                value={hijackInfo[key]}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="col-lg-6">
                      {Object.keys(hijackInfo2).map((key) => {
                        return (
                          <div className="row">
                            <div
                              className="col-lg-4"
                              style={{ fontWeight: 'bold' }}
                            >
                              {key}:
                            </div>
                            <div className="col-lg-8">
                              <input
                                id="info_type"
                                className="form-control"
                                type="text"
                                readOnly={true}
                                value={hijackInfo2[key]}
                              />
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
              <div className="card">
                <div className="card-header">Comments</div>
                <div className="card-body">
                  {hijack.comment ? (
                    <Editor
                      readOnly={true}
                      placeholder={hijack.comment}
                      editorState={editorState}
                      onChange={setEditorState}
                    />
                  ) : (
                    <> </>
                  )}
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
                      <div className="card">
                        <div
                          className={
                            'card-header multi-collapse collapse' +
                            (seenState ? 'show' : '')
                          }
                        >
                          Peers Seen Hijack BGP Announcement:
                          <Grid container spacing={3}>
                            {seen.map((value, i) => {
                              if (value !== undefined)
                                return (
                                  <Grid key={i} item xs>
                                    <Paper className={classes.paper}>
                                      {value}
                                    </Paper>
                                  </Grid>
                                );
                              else return <> </>;
                            })}
                          </Grid>
                        </div>{' '}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card">
                        <div
                          className={
                            'card-header multi-collapse collapse' +
                            (withdrawState ? 'show' : '')
                          }
                        >
                          Peers Seen Hijack BGP Withdrawal:
                          <Grid container spacing={3}>
                            {withdrawn.map((value, i) => {
                              if (value !== undefined)
                                return (
                                  <Grid key={i} item xs>
                                    <Paper className={classes.paper}>
                                      {value}
                                    </Paper>
                                  </Grid>
                                );
                              else return <> </>;
                            })}
                          </Grid>
                        </div>{' '}
                      </div>
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
                  {bgp.length > 0 ? (
                    <BGPTableComponent
                      data={bgp}
                      skippedCols={['as_path', 'hijack_key']}
                    />
                  ) : (
                    <div>
                      <p>
                        <img src="checkmark.png"></img>
                      </p>
                      <h3>No related bgp updates.</h3>
                    </div>
                  )}
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
                    {distinctValues.map((value, i) => {
                      if (value !== undefined)
                        return (
                          <Grid key={i} item xs>
                            <Paper className={classes.paper}>{value}</Paper>
                          </Grid>
                        );
                      else return <> </>;
                    })}
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotFoundHOC(ViewHijackPage, ['admin', 'user']);
