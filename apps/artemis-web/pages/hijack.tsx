import {
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Switch,
} from '@material-ui/core';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from 'react-tooltip';
import AuthHOC from '../components/401-hoc/401-hoc';
import BGPTableComponent from '../components/bgp-table/bgp-table';
import { fetchASNData } from '../utils/fetch-data';
import { useGraphQl } from '../utils/hooks/use-graphql';
import { parseASNData } from '../utils/parsers';
import { useStyles } from '../utils/styles';
import { formatDate, fromEntries, genTooltip } from '../utils/token';
import DefaultErrorPage from 'next/error';

const ViewHijackPage = (props) => {
  const [isLive, setIsLive] = useState(true);
  const isDevelopment = () => process.env.NODE_ENV === 'development';
  const isBrowser = () => typeof window !== 'undefined';

  if (isDevelopment() && isBrowser()) {
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
  const [ASNTitle, setASNTitle] = React.useState([]);
  const [ASNWithdrawnTitle, setASNWithdrawnTitle] = React.useState([]);
  const [ASNSeenTitle, setASNSeenTitle] = React.useState([]);

  const { loading, data } = useGraphQl('hijackByKey', isLive, key);
  const HIJACK_DATA = data;

  const BGP_DATA = useGraphQl('bgpByKey', isLive, key).data;
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
            value ? (
              <img alt="" src="handled.png" />
            ) : (
              <img alt="" src="./unhadled.png" />
            ),
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
    'Hijacker AS:': [
      <>
        <div data-tip data-for={'hijack_as'}>
          <input
            id="info_type"
            className="form-control"
            type="text"
            readOnly={true}
            value={hijack.hijack_as}
          />
        </div>
        <ReactTooltip html={true} id={'hijack_as'}>
          {ASNTitle[0]}
        </ReactTooltip>
      </>,
      genTooltip(
        'Hijacker AS:',
        null,
        'hijack_title_info',
        'The AS that is potentially responsible for the hijack.</br>Note that this is an experimental field.'
      ),
    ],
    Type: [
      hijack.type,
      genTooltip(
        'Type:',
        null,
        'type_title_info',
        `The type of the hijack in 4 dimensions: prefix|path|data plane|policy<ul>
      <li>[Prefix] "S" → Sub-prefix hijack</li>
      <li>[Prefix] "E" → Exact-prefix hijack</li>
      <li>[Prefix] "Q" → Squatting hijack</li>
      <li>[Path] "0" → Type-0 hijack</li>
      <li>[Path] "1" → Type-1 hijack</li>
      <li>[Path] "P" → Type-P hijack</li>
      <li>[Path] "-" → Type-N or Type-U hijack (N/A)</li>
      <li>[Data plane] "-" → Blackholing, Imposture or MitM hijack (N/A)</li>
      <li>[Policy] "L" → Route Leak due to no-export policy violation</li>
      <li>[Policy] "-" → Other policy violation (N/A)</li></ul>`
      ),
    ],
    '# Peers Seen': [
      hijack.num_peers_seen,
      genTooltip(
        '# Peers Seen:',
        null,
        'peers_title_info',
        `Number of peers/monitors (i.e., ASNs)</br>that have seen hijack updates.`
      ),
    ],
    '# ASes Infected': [
      hijack.num_asns_inf,
      genTooltip(
        '# ASes Infected:',
        null,
        'infected_title_info',
        `Number of infected ASes that seem to</br>route traffic towards the hijacker AS.</br>Note that this is an experimental field.`
      ),
    ],
    Prefix: [
      hijack.prefix,
      genTooltip(
        'Prefix:',
        null,
        'prefix_title_info',
        `The IPv4/IPv6 prefix related to the BGP update.`
      ),
    ],
    Matched: [
      hijack.configured_prefix,
      genTooltip(
        'Matched:',
        null,
        'matched_title_info',
        `The prefix that was matched in the configuration (note: this might differ from the actually hijacked prefix in the case of a sub-prefix hijack).`
      ),
    ],
    Config: [
      formatDate(new Date(hijack.timestamp_of_config)),
      genTooltip(
        'Config:',
        null,
        'config_title_info',
        `The timestamp (i.e., unique ID) of the configuration based on which this hijack event was triggered.`
      ),
    ],
    Key: [
      hijack.key,
      genTooltip(
        'Key:',
        null,
        'key_title_info',
        `The unique key of a hijack event.`
      ),
    ],
  };

  const hijackInfo2 = {
    'Time Started': [
      formatDate(new Date(hijack.time_started)),
      genTooltip(
        'Time Started:',
        null,
        'timestart_title_info',
        `The timestamp of the oldest known (to the system) BGP update that is related to the hijack.`
      ),
    ],
    'Time Detected': [
      formatDate(new Date(hijack.time_detected)),
      genTooltip(
        'Time Detected:',
        null,
        'timedetect_title_info',
        `The time when a hijack event was first detected by the system.`
      ),
    ],
    'Last Update': [
      formatDate(new Date(hijack.time_last)),
      genTooltip(
        'Last Update:',
        null,
        'lastupdate_title_info',
        `The timestamp of the newest known (to the system) BGP update that is related to the hijack.`
      ),
    ],
    'Time Ended': [
      formatDate(new Date(hijack.time_ended)),
      genTooltip(
        'Time Ended:',
        null,
        'timeended_title_info',
        `The timestamp when the hijack was ended. It can be set in the following ways:
      <ul><li>Manually, when the user presses the “resolved” button.</li>
      <li>Automatically, when a hijack is completely withdrawn (all monitors that saw hijack updates for a certain prefix have seen the respective withdrawals).</li></ul>`
      ),
    ],
    'Mitigation Started': [
      hijack.mitigation_started ?? 'Never',
      genTooltip(
        'Mitigation Started:',
        null,
        'mitigationstarted_title_info',
        `The timestamp when the mitigation was triggered by the user (“mitigate” button).`
      ),
    ],
    'Community Annotation': [
      hijack.community_annotation,
      genTooltip(
        'Community Annotation:',
        null,
        'communityannotation_title_info',
        `The user-defined annotation of the hijack according to the communities of hijacked BGP updates.`
      ),
    ],
    'RPKI Status': [
      hijack.rpki_status,
      genTooltip(
        'RPKI Status:',
        null,
        'rpkistatus_title_info',
        `The RPKI status of the hijacked prefix.<ul>
      <li>"NA" → Non Applicable</li>
      <li>"VD" → Valid</li>
      <li>"IA" → Invalid ASN</li>
      <li>"IL" → Invalid Prefix Length</li>
      <li>"IU" → Invalid Unknown</li>
      <li>"NF" → Not found</li></ul>`
      ),
    ],
    'Display Peers Seen Hijack': [
      <>
        <div data-tip data-for={'peer_as'}>
          <input
            id="info_type"
            className="form-control"
            type="text"
            readOnly={true}
            value={hijack.peers_seen}
          />
        </div>
        <ReactTooltip html={true} id={'peer_as'}>
          {ASNTitle[0]}
        </ReactTooltip>
      </>,
      genTooltip('Display Peers Seen Hijack:', null, 'peers_title_info', ``),
    ],
  };

  useEffect(() => {
    (async function setStateFn() {
      const ASN_int_origin: number = hijack.hijack_as;
      const ASN_int_peers: number = hijack.peers_seen;
      const [name_origin, countries_origin, abuse_origin] = await fetchASNData(
        ASN_int_origin
      );
      const [name_peers, countries_peers, abuse_peers] = await fetchASNData(
        ASN_int_peers
      );

      const tooltipsWithdrawn = [];
      const tooltipsSeen = [];
      const waitData1 = [];
      const waitData2 = [];

      for (let i = 0; i < withdrawn.length; i++) {
        waitData1.push(await fetchASNData(withdrawn[i]));
        tooltipsWithdrawn.push(
          parseASNData(
            withdrawn[i],
            waitData1[i][0],
            waitData1[i][1],
            waitData1[i][2]
          )
        );
      }

      for (let i = 0; i < seen.length; i++) {
        waitData2.push(await fetchASNData(seen[i]));
        tooltipsSeen.push(
          parseASNData(
            seen[i],
            waitData2[i][0],
            waitData2[i][1],
            waitData2[i][2]
          )
        );
      }

      const tooltip1 = parseASNData(
        ASN_int_origin,
        name_origin,
        countries_origin,
        abuse_origin
      );
      const tooltip2 = parseASNData(
        ASN_int_peers,
        name_peers,
        countries_peers,
        abuse_peers
      );
      setASNWithdrawnTitle(tooltipsWithdrawn);
      setASNSeenTitle(tooltipsSeen);
      setASNTitle([tooltip1, tooltip2]);
    })();
  }, [hijack]);

  return (
    <>
      <Head>
        <title>ARTEMIS - Hijack</title>
      </Head>
      {user && (HIJACK_DATA || loading) && (
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
                      {findStatus(hijack).map((status, i) => (
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
                          <div key={key} className="row">
                            <div
                              className="col-lg-4"
                              style={{ fontWeight: 'bold' }}
                            >
                              {hijackInfo[key][1]}
                            </div>
                            <div className="col-lg-8">
                              {typeof hijackInfo[key][0] !== 'object' ? (
                                <input
                                  id="info_type"
                                  className="form-control"
                                  type="text"
                                  readOnly={true}
                                  value={hijackInfo[key][0]}
                                />
                              ) : (
                                hijackInfo[key][0]
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="col-lg-6">
                      {Object.keys(hijackInfo2).map((key) => {
                        return (
                          <div key={key} className="row">
                            <div
                              className="col-lg-4"
                              style={{ fontWeight: 'bold' }}
                            >
                              {hijackInfo2[key][1]}
                            </div>
                            <div className="col-lg-8">
                              {typeof hijackInfo2[key][0] !== 'object' ? (
                                <input
                                  id="info_type"
                                  className="form-control"
                                  type="text"
                                  readOnly={true}
                                  value={hijackInfo2[key][0]}
                                />
                              ) : (
                                hijackInfo2[key][0]
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
                                      <div data-tip data-for={'withdrawn' + i}>
                                        {value}
                                      </div>
                                      <ReactTooltip
                                        html={true}
                                        id={'withdrawn' + i}
                                      >
                                        {ASNSeenTitle[i] ? ASNSeenTitle[i] : ''}
                                      </ReactTooltip>
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
                                      <div data-tip data-for={'withdrawn' + i}>
                                        {value}
                                      </div>
                                      <ReactTooltip
                                        html={true}
                                        id={'withdrawn' + i}
                                      >
                                        {ASNWithdrawnTitle[i]
                                          ? ASNWithdrawnTitle[i]
                                          : ''}
                                      </ReactTooltip>
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
                        <img alt="" src="checkmark.png" />
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
      {user &&
        (!HIJACK_DATA || !HIJACK_DATA.view_hijacks.length) &&
        !loading && (
          <DefaultErrorPage
            statusCode={404}
            title={'This hijack does not exist'}
          />
        )}
    </>
  );
};

export default AuthHOC(ViewHijackPage, ['admin', 'user']);
