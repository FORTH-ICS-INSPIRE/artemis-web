import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
} from '@material-ui/core';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-media';
import { RangePicker } from 'react-minimal-datetime-range';
import 'react-minimal-datetime-range/lib/react-minimal-datetime-range.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthHOC from '../components/401-hoc/401-hoc';
import HijackTableComponent from '../components/hijack-table/hijack-table';
import Tooltip from '../components/tooltip/tooltip';
import TooltipContext from '../context/tooltip-context';
import { setup } from '../libs/csrf';
import { AntSwitch, useStyles } from '../utils/styles';
import {
  autoLogout,
  genTooltip,
  getSimpleDates,
  GLOBAL_MEDIA_QUERIES,
  shallMock,
} from '../utils/token';

const HijacksPage = (props) => {

  if (shallMock(props.isTesting)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }

  const [isLive, setIsLive] = useState(!shallMock(props.isTesting));

  useEffect(() => {
    autoLogout(props);
  }, [props]);

  const [filterFrom, setFilterFrom] = useState(0);
  const [filterTo, setFilterTo] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterButton, setFilterButton] = useState(0);
  const [distinctValues, setDistinctValues] = useState([]);
  const [selectState, setSelectState] = useState('');
  const [statusButton, setStatusButton] = useState('');
  const [key, setKey] = useState(' ');
  const context = React.useContext(TooltipContext);
  const [tooltips, setTooltips] = useState({});
  const [filteredHijackData, setFilteredHijackData] = useState([]);

  const classes = useStyles();
  const setStatus = (status) => {
    if (status === statusButton) {
      setFilterStatus('');
      setStatusButton('');
    } else {
      setFilterStatus(status);
      setStatusButton(status);
    }
  };

  const user = props.user;

  const filteredDate = new Date();
  filteredDate.setHours(filteredDate.getHours() - filterFrom);

  const dates = getSimpleDates();
  const [dateTime1, setDateTime1] = useState(dates[0]);
  const [dateTime2, setDateTime2] = useState(dates[1]);

  const onChangeValue = (event) => {
    setDistinctValues(
      filteredHijackData
        .map((entry) => {
          return entry[event.target.value];
        })
        .filter((v, i, a) => a.indexOf(v) === i)
    );
    setSelectState(event.target.value);
  };

  const matches = useMedia({ queries: GLOBAL_MEDIA_QUERIES });

  return (
    <>
      <Head>
        <title>ARTEMIS - Hijacks</title>
      </Head>
      {user && (
        <div
          className="container overview col-lg-12"
        // style={{ paddingTop: '120px' }}
        >
          <div className="row">
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="row">
                <div className="col-lg-9" style={{ color: 'black' }}>
                  <h1>Hijacks</h1>
                </div>
                {/* <div className="col-lg-1"></div> */}
                {matches.pc && (
                  <div className="col-lg-2">
                    <h2 style={{ color: 'black' }}>Live Update:</h2>{' '}
                  </div>
                )}
                <div className="col-lg-1">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <AntSwitch
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
              </div>
              <hr style={{ backgroundColor: 'white' }} />
            </div>
          </div>
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="card">
                <div
                  className="card-header"
                  style={{ backgroundColor: 'white' }}
                >
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <Button
                            className={
                              0 === filterButton
                                ? 'selectedButton'
                                : 'defaultButton'
                            }
                            style={{ marginRight: '5px' }}
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setFilterButton(0);
                              setFilterFrom(0);
                              setFilterTo(0);
                              setSelectState('select');
                              setDistinctValues([]);
                            }}
                          >
                            {genTooltip(
                              'All',
                              null,
                              'All',
                              'The time window for seeing BGP updates or hijack events.',
                              'timefilter'
                            )}
                          </Button>
                          <Button
                            className={
                              1 === filterButton
                                ? 'selectedButton'
                                : 'defaultButton'
                            }
                            style={{ marginRight: '5px' }}
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setFilterButton(1);
                              setFilterFrom(1);
                              setFilterTo(0);
                              setSelectState('select');
                              setDistinctValues([]);
                            }}
                          >
                            {genTooltip(
                              'Past 1h',
                              null,
                              'Past 1h',
                              'The time window for seeing BGP updates or hijack events.',
                              'timefilter'
                            )}
                          </Button>
                          <Button
                            className={
                              2 === filterButton
                                ? 'selectedButton'
                                : 'defaultButton'
                            }
                            style={{ marginRight: '5px' }}
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setFilterButton(2);
                              setFilterFrom(24);
                              setFilterTo(0);
                              setSelectState('select');
                              setDistinctValues([]);
                            }}
                          >
                            {genTooltip(
                              'Past 24h',
                              null,
                              'Past 24h',
                              'The time window for seeing BGP updates or hijack events.',
                              'timefilter'
                            )}
                          </Button>
                          <Button
                            className={
                              3 === filterButton
                                ? 'selectedButton'
                                : 'defaultButton'
                            }
                            variant="outlined"
                            style={{ marginRight: '5px' }}
                            color="primary"
                            onClick={() => {
                              setFilterButton(3);
                              setFilterFrom(48);
                              setFilterTo(0);
                              setSelectState('select');
                              setDistinctValues([]);
                            }}
                          >
                            {genTooltip(
                              'Past 48h',
                              null,
                              'Past 48h',
                              'The time window for seeing BGP updates or hijack events.',
                              'timefilter'
                            )}
                          </Button>
                          <Button
                            className={
                              4 === filterButton
                                ? 'selectedButton'
                                : 'defaultButton'
                            }
                            style={{ marginRight: '5px' }}
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setFilterButton(4);
                              setSelectState('select');
                              setDistinctValues([]);
                            }}
                          >
                            {genTooltip(
                              'Custom',
                              null,
                              'Custom',
                              'The time window for seeing BGP updates or hijack events.',
                              'timefilter'
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <RangePicker
                            locale={`en-us`} // default is en-us
                            show={true} // default is false
                            disabled={false}
                            placeholder={['Start Time', 'End Time']}
                            defaultDates={[
                              dateTime1.split(' ')[0],
                              dateTime2.split(' ')[0],
                            ]} // ['YYYY-MM-DD', 'YYYY-MM-DD']
                            defaultTimes={[
                              dateTime1.split(' ')[1],
                              dateTime2.split(' ')[1],
                            ]} // ['hh:mm', 'hh:mm']
                            initialDates={[
                              dateTime1.split(' ')[0],
                              dateTime2.split(' ')[0],
                            ]} // ['YYYY-MM-DD', 'YYYY-MM-DD']
                            initialTimes={[
                              dateTime1.split(' ')[1],
                              dateTime2.split(' ')[1],
                            ]} // ['hh:mm', 'hh:mm']
                            onConfirm={(res) => {
                              setDateTime1(res[0]);
                              setDateTime2(res[1]);
                              const difference1: number =
                                (new Date().getTime() -
                                  new Date(res[0]).getTime()) /
                                36e5;
                              const difference2: number =
                                (new Date().getTime() -
                                  new Date(res[1]).getTime()) /
                                36e5;
                              setFilterFrom(difference1);
                              setFilterTo(difference2);
                            }}
                            style={{
                              float: 'left',
                              marginTop: '10px',
                              width: '600px',
                              display: 4 === filterButton ? 'block' : 'none',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5 offset-lg-1">
                      <div
                        className="form-group row"
                        style={{ textAlign: 'right' }}
                      >
                        <div className="col-sm-10">
                          <input
                            onChange={(event) => setKey(event.target.value)}
                            className="form-control"
                            placeholder="Type hijack key..."
                            id="hijack-key-input"
                          />
                        </div>
                        <div className="col-sm-1">
                          <Link href={'/hijack?key=' + key}>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              id="view-hijack-by-key-button"
                            >
                              View
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      Select Status:
                      <button
                        onClick={() => setStatus('Ongoing')}
                        type="button"
                        id="status_active_button"
                        style={{ marginLeft: '5px' }}
                        className={
                          'btn btn-sm ' +
                          ('Ongoing' === statusButton
                            ? 'btn-danger'
                            : 'btn-outline-danger')
                        }
                        title=""
                        data-toggle="tooltip"
                        data-placement="top"
                        data-original-title='<p class="tooltip-custom-margin">Ongoing hijack events</br>(not ignored or resolved).</p>'
                      >
                        {genTooltip(
                          'Ongoing',
                          null,
                          'Ongoing',
                          'Ongoing hijack events</br>(not ignored or resolved).'
                          // 'timefilter'
                        )}
                      </button>{' '}
                      /
                      <button
                        onClick={() => setStatus('Dormant')}
                        type="button"
                        id="status_dormant_button"
                        style={{ marginLeft: '5px' }}
                        className={
                          'btn btn-sm ' +
                          ('Dormant' === statusButton
                            ? 'btn-secondary'
                            : 'btn-outline-secondary')
                        }
                        title=""
                        data-toggle="tooltip"
                        data-placement="top"
                        data-original-title='<p class="tooltip-custom-margin">Dormant hijack events</br>(ongoing, but not updated within the last X hours).</p>'
                      >
                        {genTooltip(
                          'Dormant',
                          null,
                          'Dormant',
                          'Dormant hijack events</br>(ongoing, but not updated within the last X hours).'
                          // 'timefilter'
                        )}
                      </button>{' '}
                      /
                      <button
                        onClick={() => setStatus('Resolved')}
                        type="button"
                        id="status_resolved_button"
                        style={{ marginLeft: '5px' }}
                        className={
                          'btn btn-sm ' +
                          ('Resolved' === statusButton
                            ? 'btn-success'
                            : 'btn-outline-success')
                        }
                        title=""
                        data-toggle="tooltip"
                        data-placement="top"
                        data-original-title='<p class="tooltip-custom-margin">Resolved hijack events</br>(marked by the user).</p>'
                      >
                        {genTooltip(
                          'Resolved',
                          null,
                          'Resolved',
                          'Resolved hijack events</br>(marked by the user).'
                          // 'timefilter'
                        )}
                      </button>{' '}
                      /
                      <button
                        onClick={() => setStatus('Ignored')}
                        type="button"
                        id="status_ignored_button"
                        style={{ marginLeft: '5px' }}
                        className={
                          'btn btn-sm ' +
                          ('Ignored' === statusButton
                            ? 'btn-warning'
                            : 'btn-outline-warning')
                        }
                        title=""
                        data-toggle="tooltip"
                        data-placement="top"
                        data-original-title='<p class="tooltip-custom-margin">Ignored hijack events</br>(marked by the user).</p>'
                      >
                        {genTooltip(
                          'Ignored',
                          null,
                          'Ignored',
                          'Ignored hijack events</br>(marked by the user).'
                          // 'timefilter'
                        )}
                      </button>{' '}
                      /
                      <button
                        onClick={() => setStatus('Under Mitigation')}
                        type="button"
                        id="status_under_mitigation_button"
                        style={{ marginLeft: '5px' }}
                        className={
                          'btn btn-sm ' +
                          ('Under Mitigation' === statusButton
                            ? 'btn-primary'
                            : 'btn-outline-primary')
                        }
                        title=""
                        data-toggle="tooltip"
                        data-placement="top"
                        data-original-title='<p class="tooltip-custom-margin">Hijack events that are currently under mitigation (triggered by the user)</br>Hijack events that are currently under mitigation</br>(triggered by the user).</p>'
                      >
                        {genTooltip(
                          'Under Mitigation',
                          null,
                          'Under Mitigation',
                          'Hijack events that are currently under mitigation</br>(triggered by the user).'
                          // 'timefilter'
                        )}
                      </button>{' '}
                      /
                      <button
                        onClick={() => setStatus('Withdrawn')}
                        type="button"
                        id="status_withdrawn_button"
                        style={{ marginLeft: '5px' }}
                        className={
                          'btn btn-sm ' +
                          ('Withdrawn' === statusButton
                            ? 'btn-info'
                            : 'btn-outline-info')
                        }
                        title=""
                        data-toggle="tooltip"
                        data-placement="top"
                        data-original-title='<p class="tooltip-custom-margin">Withdrawn hijack events</br>(marked automatically).</p>'
                      >
                        {genTooltip(
                          'Withdrawn',
                          null,
                          'Withdrawn',
                          'Withdrawn hijack events</br>(marked automatically).'
                          // 'timefilter'
                        )}
                      </button>{' '}
                      /
                      <button
                        onClick={() => setStatus('Outdated')}
                        type="button"
                        id="status_outdated_button"
                        style={{ marginLeft: '5px' }}
                        className={
                          'btn btn-sm ' +
                          ('Outdated' === statusButton
                            ? 'btn-dark'
                            : 'btn-outline-dark')
                        }
                        title=""
                        data-toggle="tooltip"
                        data-placement="top"
                        data-original-title='<p class="tooltip-custom-margin">Hijack events that match a configuration that is now deprecated</br>(marked by the user).</p>'
                      >
                        {genTooltip(
                          'Outdated',
                          null,
                          'Outdated',
                          'Hijack events that match a configuration that is now deprecated</br>(marked by the user).'
                          // 'timefilter'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <HijackTableComponent
                    {...props}
                    filter={filterFrom}
                    filterTo={filterTo}
                    isLive={isLive}
                    filterStatus={filterStatus}
                    setFilteredHijackData={setFilteredHijackData}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="card">
                <div
                  className="card-header"
                  style={{ backgroundColor: 'white' }}
                >
                  <span style={{ float: 'right', marginTop: '15px' }}>
                    Times are shown in your local time zone{' '}
                    <b>GMT{new Date().getTimezoneOffset() > 0 ? '-' : '+'}{Math.abs(new Date().getTimezoneOffset() / 60)} ({Intl.DateTimeFormat().resolvedOptions().timeZone}).</b>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <h1>Additional actions</h1>
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
                      <option value="prefix">Hijacked Prefix</option>
                      <option value="configured_prefix">Matched Prefix</option>
                      <option value="hijack_as">Hijack AS</option>
                      <option value="rpki_status">RPKI</option>
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
                        if (selectState === 'hijack_as')
                          value =
                            asn === -1 ? (
                              <span>-</span>
                            ) : (
                              <Tooltip
                                tooltips={tooltips}
                                setTooltips={setTooltips}
                                asn={asn}
                                label={`originH${i}`}
                                context={context}
                              />
                            );
                        return (
                          <Grid key={i} item xs={3}>
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
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default AuthHOC(HijacksPage, ['admin', 'user']);

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return { props: { _csrf: csrftoken, isTesting: process.env.TESTING === 'true',  _inactivity_timeout: process.env.INACTIVITY_TIMEOUT, system_version: process.env.SYSTEM_VERSION } };
});
