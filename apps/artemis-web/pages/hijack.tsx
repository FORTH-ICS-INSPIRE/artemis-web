import {
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Switch,
} from '@material-ui/core';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { animated, useTransition } from 'react-spring';
import 'react-toastify/dist/ReactToastify.css';
import AuthHOC from '../components/401-hoc/401-hoc';
import BGPTableComponent from '../components/bgp-table/bgp-table';
import Tooltip from '../components/tooltip/tooltip';
import TooltipContext from '../context/tooltip-context';
import { useGraphQl } from '../utils/hooks/use-graphql';
import { extractHijackInfos } from '../utils/parsers';
import { useStyles } from '../utils/styles';
import { formatDate, fromEntries, shallMock } from '../utils/token';

const ViewHijackPage = (props) => {
  const [isLive, setIsLive] = useState(true);
  const [tooltips, setTooltips] = useState({});
  const context = React.useContext(TooltipContext);

  if (shallMock()) {
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
  const key: string = router.query.key.toString() ?? '';
  const user = props.user;

  const [distinctValues, setDistinctValues] = useState([]);
  const [selectState, setSelectState] = useState('');
  const [seenState, setSeenState] = useState(false);
  const [withdrawState, setWithdrawState] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
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
      bgp
        .map((entry) => {
          return entry[event.target.value];
        })
        .filter((v, i, a) => a.indexOf(v) === i)
    );
  };

  const [hijackInfoLeft, hijackInfoRight] = extractHijackInfos(hijack, {
    tooltips: tooltips,
    setTooltips: setTooltips,
    context: context,
  });

  const asns = [];
  bgp.forEach((entry, i) => {
    entry.id = i;
    if (!asns.includes(entry.origin_as))
      asns.push(
        entry.origin_as === '-'
          ? entry.origin_as
          : parseInt(entry.origin_as, 10)
      );
    if (!asns.includes(entry.peer_asn))
      asns.push(
        entry.peer_asn === '-' ? entry.peer_asn : parseInt(entry.peer_asn, 10)
      );
  });

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
                    </div>
                    <div className="col-lg-6">
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
                                      <Grid key={i} item xs>
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
                      asns={asns}
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
