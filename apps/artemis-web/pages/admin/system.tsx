import { Button, Grid } from '@material-ui/core';
import { formatDate, shallMock } from '../../utils/token';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import {
  Controlled as CodeMirror,
  IControlledCodeMirror,
} from 'react-codemirror2';
import AuthHOC from '../../components/401-hoc/401-hoc';
import SystemModule from '../../components/system-module/system-module';
import { useGraphQl } from '../../utils/hooks/use-graphql';

const SystemPage = (props) => {
  if (shallMock()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../../utils/mock-sw/browser');
    worker.start();
  }
  type currentType = {
    props: any;
  };
  const configRef = React.createRef<any>();
  const commentRef = React.createRef<any>();
  const [alertState, setAlertState] = useState('none');
  const [editState, setEditState] = useState(false);
  const [configState, setConfigState] = useState('');
  const [commentState, setCommentState] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  async function onClick(e, action) {
    e.preventDefault();
    if (action === 'save') {
      const new_config = configRef.current.props.value;
      const comment = commentRef.current.props.value;
      const res = await fetch('/api/config', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_config: new_config, comment: comment }),
      });

      if (res.status === 200) {
        setAlertState('block');
        setAlertMessage('Configuration file updated.');
      }
    } else {
      const res = await fetch('/api/as_sets', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        const resp = await res.json();
        console.log(resp);
        setAlertState('block');
        setAlertMessage(resp.payload.payload.message);
      }
    }
  }

  const user = props.user;

  const STATS_RES: any = useGraphQl('stats', {
    isLive: true,
    hasDateFilter: false,
    hasColumnFilter: false,
  });
  const STATS_DATA: any = STATS_RES?.data;
  let CONFIG_DATA: any = useGraphQl('config', {
    isLive: false,
    hasDateFilter: false,
    hasColumnFilter: false,
  });
  CONFIG_DATA = CONFIG_DATA?.data;

  const processes = STATS_DATA ? STATS_DATA.view_processes : null;

  const modules = processes
    ? processes.map((ps) => {
        return [
          ps['name'].charAt(0).toUpperCase() + ps['name'].slice(1),
          ps['running'],
        ];
      })
    : [];

  const states = {};

  modules.forEach((module) => (states[module[0].toString()] = module[1]));

  const [state, setState] = useState(states);
  const keys = Object.keys(state);

  if (modules.length !== 0 && keys.length === 0) setState(states);

  useEffect(() => {
    if (CONFIG_DATA && CONFIG_DATA.view_configs[0]) {
      setConfigState(CONFIG_DATA.view_configs[0].raw_config.toString());
      setCommentState(CONFIG_DATA.view_configs[0].comment);
    }
  }, [CONFIG_DATA]);

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
                  {keys.map((module, i) => {
                    return (
                      <SystemModule
                        key={i}
                        module={module}
                        state={state}
                        setState={setState}
                      />
                    );
                  })}
                </Grid>
              </div>
            </div>
            <div style={{ marginTop: '20px' }} className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="card">
                  <div className="card-header">
                    {' '}
                    Current Configuration{' '}
                    {editState ? (
                      <>
                        <Button
                          onClick={(e) => onClick(e, 'save')}
                          style={{ float: 'right' }}
                          variant="contained"
                          color="primary"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditState(!editState)}
                          style={{ float: 'right' }}
                          variant="contained"
                          color="secondary"
                        >
                          cancel
                        </Button>{' '}
                      </>
                    ) : (
                      <Button
                        onClick={() => setEditState(!editState)}
                        style={{ float: 'right' }}
                        variant="contained"
                        color="secondary"
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      onClick={(e) => onClick(e, 'load')}
                      style={{ float: 'right' }}
                      variant="contained"
                      color="primary"
                    >
                      Load AS-SETs
                    </Button>
                  </div>
                  <div id="config" className="card-body">
                    <div style={{ display: alertState }} id="config_alert_box">
                      <div className="alert alert-success alert-dismissible">
                        <a
                          href="#"
                          className="close"
                          data-dismiss="alert"
                          aria-label="close"
                        >
                          ×
                        </a>
                        {alertMessage}
                      </div>
                    </div>
                    <CodeMirror
                      ref={configRef}
                      value={configState}
                      options={{
                        mode: 'yaml',
                        styleActiveLine: true,
                        foldGutter: true,
                        gutters: [
                          'CodeMirror-linenumbers',
                          'CodeMirror-foldgutter',
                        ],
                        theme: 'material',
                        lineNumbers: true,
                      }}
                      onBeforeChange={(editor, data, value) => {
                        if (editState) setConfigState(value);
                      }}
                    />
                    <div>
                      <span style={{ float: 'left' }}>
                        Last Update:{' '}
                        {CONFIG_DATA
                          ? formatDate(
                              new Date(
                                CONFIG_DATA.view_configs[0].time_modified
                              )
                            )
                          : 'Never'}
                      </span>
                      <span style={{ float: 'right' }}>
                        Times are shown in your local time zone GMT
                        {new Date().getTimezoneOffset() < 0 ? '+' : ''}
                        {-(new Date().getTimezoneOffset() / 60)} (
                        {Intl.DateTimeFormat().resolvedOptions().timeZone}).
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="card">
                  <div className="card-header">Comment for config</div>
                  <div className="card-body">
                    <CodeMirror
                      ref={commentRef}
                      value={commentState}
                      options={{
                        mode: 'yaml',
                        styleActiveLine: true,
                        foldGutter: true,
                        gutters: [
                          'CodeMirror-linenumbers',
                          'CodeMirror-foldgutter',
                        ],
                        theme: 'material',
                        lineNumbers: true,
                      }}
                      onBeforeChange={(editor, data, value) => {
                        if (editState) setCommentState(value);
                      }}
                    />
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

export default AuthHOC(SystemPage, ['admin']);
