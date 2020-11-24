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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFoundHOC from '../components/404-hoc/404-hoc';
import HijackTableComponent from '../components/hijack-table/hijack-table';
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

const HijacksPage = (props) => {
  const [isLive, setIsLive] = useState(true);

  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { worker } = require('../utils/mock-sw/browser');
      worker.start();
    }
  }

  const classes = useStyles();

  const [filterDate, setFilterDate] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterButton, setFilterButton] = useState(0);
  const [distinctValues, setDistinctValues] = useState([]);
  const [selectState, setSelectState] = useState('');
  const [statusButton, setStatusButton] = useState(-1);

  const statuses = [
    'Ongoing',
    'Dormant',
    'Resolved',
    'Ignored',
    'Under Mitigation',
    'Withdrawn',
    'Outdated',
  ];

  const user = props.user;

  const findStatus = (row) => {
    if (row.withdrawn) return 'Withdrawn';
    else if (row.resolved) return 'Resolved';
    else if (row.ignored) return 'Ignored';
    else if (row.active) return 'Active';
    else if (row.dormant) return 'Dormant';
    else if (row.under_mitigation) return 'Under Mitigation';
    else if (row.outdated) return 'Outdated';
    else return '';
  };

  const setStatus = (id) => {
    if (id === statusButton) {
      setFilterStatus('');
      setStatusButton(-1);
    } else {
      setFilterStatus(statuses[id]);
      setStatusButton(id);
    }
  };

  const HIJACK_DATA = useGraphQl('hijack', props.isProduction, isLive);

  let hijacks = HIJACK_DATA ? HIJACK_DATA.view_hijacks : [];
  hijacks = hijacks.map((entry) => ({ ...entry, status: findStatus(entry) }));
  const filteredDate = new Date();
  filteredDate.setHours(filteredDate.getHours() - filterDate);

  console.log(filterDate);
  const filteredHijacks =
    filterDate !== 0
      ? hijacks.filter(
          (entry) =>
            new Date(entry.timestamp) >= filteredDate &&
            (entry.status === filterStatus || '' === filterStatus)
        )
      : hijacks.filter(
          (entry) => entry.status === filterStatus || '' === filterStatus
        );

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
                      setFilterDate(0);
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
                      setFilterDate(1);
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
                      setFilterDate(24);
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
                      setFilterDate(48);
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
          <div className="row">
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="card">
                <div className="card-header">
                  Select Status:
                  <button
                    onClick={() => setStatus(0)}
                    type="button"
                    id="status_active_button"
                    style={{ marginLeft: '5px' }}
                    className={
                      'btn btn-sm ' +
                      (0 === statusButton ? 'btn-danger' : 'btn-outline-danger')
                    }
                    title=""
                    data-toggle="tooltip"
                    data-placement="top"
                    data-original-title='<p class="tooltip-custom-margin">Ongoing hijack events</br>(not ignored or resolved).</p>'
                  >
                    Ongoing
                  </button>{' '}
                  /
                  <button
                    onClick={() => setStatus(1)}
                    type="button"
                    id="status_dormant_button"
                    style={{ marginLeft: '5px' }}
                    className={
                      'btn btn-sm ' +
                      (1 === statusButton
                        ? 'btn-secondary'
                        : 'btn-outline-secondary')
                    }
                    title=""
                    data-toggle="tooltip"
                    data-placement="top"
                    data-original-title='<p class="tooltip-custom-margin">Dormant hijack events</br>(ongoing, but not updated within the last X hours).</p>'
                  >
                    Dormant
                  </button>{' '}
                  /
                  <button
                    onClick={() => setStatus(2)}
                    type="button"
                    id="status_resolved_button"
                    style={{ marginLeft: '5px' }}
                    className={
                      'btn btn-sm ' +
                      (2 === statusButton
                        ? 'btn-success'
                        : 'btn-outline-success')
                    }
                    title=""
                    data-toggle="tooltip"
                    data-placement="top"
                    data-original-title='<p class="tooltip-custom-margin">Resolved hijack events</br>(marked by the user).</p>'
                  >
                    Resolved
                  </button>{' '}
                  /
                  <button
                    onClick={() => setStatus(3)}
                    type="button"
                    id="status_ignored_button"
                    style={{ marginLeft: '5px' }}
                    className={
                      'btn btn-sm ' +
                      (3 === statusButton
                        ? 'btn-warning'
                        : 'btn-outline-warning')
                    }
                    title=""
                    data-toggle="tooltip"
                    data-placement="top"
                    data-original-title='<p class="tooltip-custom-margin">Ignored hijack events</br>(marked by the user).</p>'
                  >
                    Ignored
                  </button>{' '}
                  /
                  <button
                    onClick={() => setStatus(4)}
                    type="button"
                    id="status_under_mitigation_button"
                    style={{ marginLeft: '5px' }}
                    className={
                      'btn btn-sm ' +
                      (4 === statusButton
                        ? 'btn-primary'
                        : 'btn-outline-primary')
                    }
                    title=""
                    data-toggle="tooltip"
                    data-placement="top"
                    data-original-title='<p class="tooltip-custom-margin">Hijack events that are currently under mitigation</br>(triggered by the user).</p>'
                  >
                    Under Mitigation
                  </button>{' '}
                  /
                  <button
                    onClick={() => setStatus(5)}
                    type="button"
                    id="status_withdrawn_button"
                    style={{ marginLeft: '5px' }}
                    className={
                      'btn btn-sm ' +
                      (5 === statusButton ? 'btn-info' : 'btn-outline-info')
                    }
                    title=""
                    data-toggle="tooltip"
                    data-placement="top"
                    data-original-title='<p class="tooltip-custom-margin">Withdrawn hijack events</br>(marked automatically).</p>'
                  >
                    Withdrawn
                  </button>{' '}
                  /
                  <button
                    onClick={() => setStatus(6)}
                    type="button"
                    id="status_outdated_button"
                    style={{ marginLeft: '5px' }}
                    className={
                      'btn btn-sm ' +
                      (6 === statusButton ? 'btn-dark' : 'btn-outline-dark')
                    }
                    title=""
                    data-toggle="tooltip"
                    data-placement="top"
                    data-original-title='<p class="tooltip-custom-margin">Hijack events that match a configuration that is now deprecated</br>(marked by the user).</p>'
                  >
                    Outdated
                  </button>
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
