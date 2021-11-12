import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
} from '@material-ui/core';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Media from 'react-media';
import { RangePicker } from 'react-minimal-datetime-range';
import 'react-minimal-datetime-range/lib/react-minimal-datetime-range.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotAuthHOC from '../components/401-hoc/401-hoc';
import BGPTableComponent from '../components/bgp-table/bgp-table';
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

const BGPUpdates = (props) => {
  const context = React.useContext(TooltipContext);
  const _csrf = props._csrf;

  if (shallMock(props.isTesting)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }

  const [isLive, setIsLive] = useState(!shallMock(props.isTesting));

  useEffect(() => {
    autoLogout(props);
  }, [props]);

  const classes = useStyles();

  const [filterFrom, setFilterFrom] = useState(0);
  const [filterTo, setFilterTo] = useState(0);
  const [filterButton, setFilterButton] = useState(0);
  const [distinctValues, setDistinctValues] = useState([]);
  const [selectState, setSelectState] = useState('');
  const [tooltips, setTooltips] = useState({});
  const [filteredBgpData, setFilteredBgpData] = useState([]);

  const user = props.user;

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

  const dates = getSimpleDates();

  const [dateTime1, setDateTime1] = useState(dates[0]);
  const [dateTime2, setDateTime2] = useState(dates[1]);

  return (
    <>
      <Head>
        <title>ARTEMIS - BGP Updates</title>
      </Head>
      {user && (
        <Media queries={GLOBAL_MEDIA_QUERIES}>
          {(matches) => (
            <div className="container overview col-lg-12">
              <div className="row">
                <div className="col-lg-1" />
                <div className="col-lg-10">
                  <div className="row">
                    <div className="col-lg-9" style={{ color: 'white' }}>
                      <h1 style={{ color: 'black' }}>BGP Updates</h1>
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
                            style={{ marginRight: '5px' }}
                            variant="outlined"
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
                    <div className="card-body" style={{ textAlign: 'center' }}>
                      <BGPTableComponent
                        filter={filterFrom}
                        filterTo={filterTo}
                        isLive={isLive}
                        _csrf={_csrf}
                        setFilteredBgpData={setFilteredBgpData}
                      />
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
                          <option value="prefix">Prefix</option>
                          <option value="matched_prefix">Matched Prefix</option>
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
                              value =
                                asn === -1 ? (
                                  <span>-</span>
                                ) : (
                                  <Tooltip
                                    tooltips={tooltips}
                                    setTooltips={setTooltips}
                                    asn={asn}
                                    label={`originD${i}`}
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
        </Media>
      )}
    </>
  );
};

export default NotAuthHOC(BGPUpdates, ['admin', 'user']);

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return {
    props: {
      _csrf: csrftoken,
      isTesting: process.env.TESTING === 'true',
      _inactivity_timeout: process.env.INACTIVITY_TIMEOUT,
      system_version: process.env.SYSTEM_VERSION,
    },
  };
});
