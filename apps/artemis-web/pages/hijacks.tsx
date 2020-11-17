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
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFoundHOC from '../components/404-hoc/404-hoc';
import HijackTableComponent from '../components/hijack-table/hijack-table';
import { useGraphQl } from '../hooks/useGraphQL';

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

const HijacksPage = (props) => {
  const [isLive, setIsLive] = useState(true);

  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { worker } = require('../mocks/browser');
      worker.start();
    }
  }

  const classes = useStyles();

  const [filter, setFilter] = useState(0);
  const [filterButton, setFilterButton] = useState(0);
  const [distinctValues, setDistinctValues] = useState([]);
  const [selectState, setSelectState] = useState('');

  const user = props.user;

  const HIJACK_DATA = useGraphQl('hijack', props.isProduction, isLive);

  const hijacks = HIJACK_DATA ? HIJACK_DATA.view_hijacks : [];
  const filteredDate = new Date();
  filteredDate.setHours(filteredDate.getHours() - filter);

  const filteredHijacks =
    filter !== 0
      ? hijacks.filter((entry) => new Date(entry.timestamp) >= filteredDate)
      : hijacks;

  const onChangeValue = (event) => {
    setDistinctValues(
      filteredHijacks.map((entry) => {
        return entry[event.target.value];
      })
    );
    setSelectState(event.target.value);
  };

  return (
    <>
      <Head>
        <title>ARTEMIS - Hijacks</title>
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
                  <h1>Hijacks</h1>
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
                  <HijackTableComponent data={filteredHijacks} />
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

export default NotFoundHOC(HijacksPage, ['admin', 'user']);
