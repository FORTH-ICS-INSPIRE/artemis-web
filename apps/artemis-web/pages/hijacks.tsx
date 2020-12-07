import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
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
import { useStyles } from '../utils/styles';

const HijacksPage = (props) => {
  const [isLive, setIsLive] = useState(true);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isBrowser = typeof window !== 'undefined';

  if (isDevelopment && isBrowser) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }

  const classes = useStyles();

  const [filterDate, setFilterDate] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterButton, setFilterButton] = useState(0);
  const [distinctValues, setDistinctValues] = useState([]);
  const [selectState, setSelectState] = useState('');
  const [statusButton, setStatusButton] = useState('');
  const [key, setKey] = useState(' ');

  const user = props.user;

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

  const setStatus = (status) => {
    if (status === statusButton) {
      setFilterStatus('');
      setStatusButton('');
    } else {
      setFilterStatus(status);
      setStatusButton(status);
    }
  };

  const HIJACK_DATA = useGraphQl('hijack', isLive);

  let hijacks = HIJACK_DATA ? HIJACK_DATA.view_hijacks : [];
  hijacks = hijacks.map((entry) => ({
    ...entry,
    status: findStatus(entry)[0] ?? '',
  }));
  const filteredDate = new Date();
  filteredDate.setHours(filteredDate.getHours() - filterDate);

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
                  <div className="row">
                    <div className="col-lg-7">
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
                    <div className="col-lg-3">
                      <div
                        className="form-group row"
                        style={{ textAlign: 'right' }}
                      >
                        {/* <div className="col-sm-4"> </div> */}
                        <div className="col-sm-11">
                          <input
                            onChange={(event) => setKey(event.target.value)}
                            className="form-control"
                            placeholder="Type hijack key..."
                            id="hijack-key-input"
                          />
                        </div>
                        <div className="col-sm-1">
                          <button
                            onClick={() =>
                              window.location.replace('/hijack?key=' + key)
                            }
                            type="button"
                            className="btn btn-secondary"
                            id="view-hijack-by-key-button"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body" style={{ textAlign: 'center' }}>
                  {filteredHijacks.length > 0 ? (
                    <HijackTableComponent data={filteredHijacks} />
                  ) : (
                    <div>
                      <p>
                        <img alt="" src="checkmark.png"></img>
                      </p>
                      <h3>No hijack alerts.</h3>
                    </div>
                  )}
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
                    Ongoing
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
                    Dormant
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
                    Resolved
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
                    Ignored
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
                    data-original-title='<p class="tooltip-custom-margin">Hijack events that are currently under mitigation</br>(triggered by the user).</p>'
                  >
                    Under Mitigation
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
                    Withdrawn
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
                      else return <> </>;
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
