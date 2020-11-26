import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  makeStyles,
  Paper,
  Switch,
} from '@material-ui/core';
import Head from 'next/head';
import React, { useCallback, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFoundHOC from '../components/404-hoc/404-hoc';
import BGPTableComponent from '../components/bgp-table/bgp-table';
import { useGraphQl } from '../utils/hooks/use-graphql';

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

const BGPUpdates = (props) => {
  const [isLive, setIsLive] = useState(true);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isBrowser = typeof window !== 'undefined';

  if (isDevelopment && isBrowser) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }

  const classes = useStyles();

  const [filter, setFilter] = useState(0);
  const [filterButton, setFilterButton] = useState(0);
  const [distinctValues, setDistinctValues] = useState([]);
  const [selectState, setSelectState] = useState('');

  const user = props.user;
  const BGP_DATA = useGraphQl('bgpupdates', isLive);

  const bgp = BGP_DATA ? BGP_DATA.view_bgpupdates : [];
  const filteredDate = new Date();
  filteredDate.setHours(filteredDate.getHours() - filter);

  const filteredBgp =
    filter !== 0
      ? bgp.filter((entry) => new Date(entry.timestamp) >= filteredDate)
      : bgp;

  const onChangeValue = (event) => {
    setSelectState(event.target.value);

    setDistinctValues(
      filteredBgp.map((entry) => {
        return entry[event.target.value];
      })
    );
  };

  return (
    <>
      <Head>
        <title>ARTEMIS - BGP Updates</title>
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
                  <h1>BGP Updates</h1>
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
              </div>

              <hr style={{ backgroundColor: 'white' }} />
            </div>
          </div>
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="card">
                <div className="card-header">
                  <Button
                    className={0 === filterButton ? 'selectedButton' : ''}
                    style={{ marginRight: '5px' }}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setFilterButton(0);
                      setFilter(0);
                      setSelectState('select');
                      setDistinctValues([]);
                    }}
                  >
                    All
                  </Button>
                  <Button
                    className={1 === filterButton ? 'selectedButton' : ''}
                    style={{ marginRight: '5px' }}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setFilterButton(1);
                      setFilter(1);
                      setSelectState('select');
                      setDistinctValues([]);
                    }}
                  >
                    Past 1h
                  </Button>
                  <Button
                    className={2 === filterButton ? 'selectedButton' : ''}
                    style={{ marginRight: '5px' }}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setFilterButton(2);
                      setFilter(24);
                      setSelectState('select');
                      setDistinctValues([]);
                    }}
                  >
                    Past 24h
                  </Button>
                  <Button
                    className={3 === filterButton ? 'selectedButton' : ''}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setFilterButton(3);
                      setFilter(48);
                      setSelectState('select');
                      setDistinctValues([]);
                    }}
                  >
                    Past 48h
                  </Button>
                </div>
                <div className="card-body">
                  <BGPTableComponent data={filteredBgp} />
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
                      if (value !== undefined)
                        return (
                          <Grid key={i} item xs>
                            <Paper className={classes.paper}>{value}</Paper>
                          </Grid>
                        );
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

export default NotFoundHOC(BGPUpdates, ['admin', 'user']);
