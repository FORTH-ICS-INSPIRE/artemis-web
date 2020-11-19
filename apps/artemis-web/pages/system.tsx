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

const SystemPage = (props) => {
  const user = props.user;
  const modules = [
    ['Monitor', false],
    ['Detection', false],
    ['Mitigation', false],
  ];

  const states = {};
  modules.forEach((module) => (states[module[0].toString()] = module[1]));

  const [state, setState] = useState(states);

  return (
    <>
      <Head>
        <title>ARTEMIS - System</title>
      </Head>
      <div id="page-container" style={{ paddingTop: '120px' }}>
        {user && (
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
                  {Object.keys(state).map((module) => {
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
