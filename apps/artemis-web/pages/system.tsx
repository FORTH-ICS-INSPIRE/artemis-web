import { Button, FormControlLabel, FormGroup, Switch } from '@material-ui/core';
import Head from 'next/head';
import React, { useState } from 'react';
import NotFoundHOC from '../components/404-hoc/404-hoc';

const SystemPage = (props) => {
  const user = props.user;
  const [isMonitorActive, setIsMonitorActive] = useState(false);
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [isMitigationActive, setIsMitigationActive] = useState(false);

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
              <div className="col-lg-3">
                <div className="card">
                  <div className="card-header"> Monitor Module</div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-3">
                        <Button
                          variant="contained"
                          color={isMonitorActive ? 'primary' : 'secondary'}
                        >
                          {isMonitorActive ? 'Active (1/1)' : 'Active (0/1)'}
                        </Button>
                      </div>
                      <div className="col-lg-3">
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                onChange={() => {
                                  setIsMonitorActive(!isMonitorActive);
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
              </div>
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header">Detection Module</div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-3">
                        <Button
                          variant="contained"
                          color={isDetectionActive ? 'primary' : 'secondary'}
                        >
                          {isDetectionActive ? 'Active (1/1)' : 'Active (0/1)'}
                        </Button>
                      </div>
                      <div className="col-lg-3">
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                onChange={() => {
                                  setIsDetectionActive(!isDetectionActive);
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
              </div>
              <div className="col-lg-3">
                <div className="card">
                  <div className="card-header">Mitigation Module</div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-3">
                        <Button
                          variant="contained"
                          color={isMitigationActive ? 'primary' : 'secondary'}
                        >
                          {isMitigationActive ? 'Active (1/1)' : 'Active (0/1)'}
                        </Button>
                      </div>
                      <div className="col-lg-3">
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                onChange={() => {
                                  setIsMitigationActive(!isMitigationActive);
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
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotFoundHOC(SystemPage, ['admin']);
