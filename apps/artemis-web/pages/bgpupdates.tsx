import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Switch,
} from '@material-ui/core';
import { Card, CardBody } from '@windmill/react-ui';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-media';
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
  const [isLive, setIsLive] = useState(true);
  const context = React.useContext(TooltipContext);
  const _csrf = props._csrf;

  if (shallMock()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }

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

  const matches = useMedia({ queries: GLOBAL_MEDIA_QUERIES });

  return (
    <>
      <Head>
        <title>ARTEMIS - BGP Updates</title>
      </Head>
      {user && (
        <div className="absolute w-full h-full">
          {/* Page title ends */}
          <div className="w-3/4 mx-auto px-6">
            <h1 className="my-6 inline-block w-full text-2xl font-semibold text-gray-700 dark:text-gray-200">
              <div className="w-1/2 float-left">BGP Updates</div>

              {matches.pc && (
                <div className="w-1/2 inline-block float-right">
                  <FormGroup className="float-right ml-8 relative -top-3">
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
                  <h2 className="float-right" style={{ color: 'black' }}>Live Update:</h2>{' '}
                </div>
              )}
            </h1>

            {/* <h2 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Ongoing, Non-Dormant Hijacks</h2> */}
            <Card className="mb-8 shadow-md">
              <CardBody>
                <div className="w-full mb-12">
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
                <BGPTableComponent
                  filter={filterFrom}
                  filterTo={filterTo}
                  isLive={isLive}
                  _csrf={_csrf}
                  setFilteredBgpData={setFilteredBgpData}
                />
              </CardBody>
            </Card>

            <div className="w-full pr-8 float-left">
              <h2 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Additional actions</h2>
              <Card className="mb-3 shadow-md">
                <CardBody>
                  <select
                    className="form-control w-1/4"
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
                </CardBody>
              </Card>
              <Card>
                <CardBody className="card-header">
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
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotAuthHOC(BGPUpdates, ['admin', 'user']);

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return { props: { _csrf: csrftoken, _inactivity_timeout: process.env.INACTIVITY_TIMEOUT, system_version: process.env.SYSTEM_VERSION } };
});
