import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
} from '@material-ui/core';
import Head from 'next/head';
import React, { useState } from 'react';
import NotFoundHOC from '../components/404-hoc/404-hoc';
import { useGraphQl } from '../hooks/useGraphQL';

const SystemPage = (props) => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { worker } = require('../mocks/browser');
      worker.start();
    }
  }

  const user = props.user;

  const STATS_DATA = useGraphQl('stats', props.isProduction);

  const processes = STATS_DATA ? STATS_DATA.view_processes : null;

  const modules = processes
    ? processes.map((ps) => {
        return [ps['name'], ps['running']];
      })
    : [];

  const states = {};

  modules.forEach((module) => (states[module[0].toString()] = module[1]));

  const [state, setState] = useState(states);
  const keys = Object.keys(state);

  if (modules.length !== 0 && keys.length === 0) setState(states);

  return (
    <>
      <Head>
        <title>ARTEMIS - System</title>
      </Head>
      <div id="page-container" style={{ paddingTop: '120px' }}>
        {user && state && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="row">
                  <div className="col-lg-8">
                    <h1 style={{ color: 'white' }}>System</h1>{' '}
                  </div>
                  <div className="col-lg-1"></div>
                </div>
                <hr style={{ backgroundColor: 'white' }} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <Grid container spacing={3}>
                  {keys.map((module) => {
                    return (
                      <Grid item xs={4}>
                        <div className="card">
                          <div className="card-header"> {module} Module</div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-lg-3">
                                <Button
                                  variant="contained"
                                  color={
                                    state[module] ? 'primary' : 'secondary'
                                  }
                                >
                                  {state[module]
                                    ? 'Active (1/1)'
                                    : 'Active (0/1)'}
                                </Button>
                              </div>
                              <div className="col-lg-3">
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={state[module]}
                                        onChange={() => {
                                          setState((prevState) => ({
                                            ...prevState,
                                            [module]: !state[module],
                                          }));
                                        }}
                                        size="medium"
                                      />
                                    }
                                    label=""
                                  />
                                </FormGroup>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    );
                  })}
                </Grid>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotFoundHOC(SystemPage, ['admin']);
