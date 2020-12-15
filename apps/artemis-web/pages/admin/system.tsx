import { Grid } from '@material-ui/core';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import Head from 'next/head';
import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import AuthHOC from '../../components/401-hoc/401-hoc';
import SystemModule from '../../components/system-module/system-module';
import { useGraphQl } from '../../utils/hooks/use-graphql';

const SystemPage = (props) => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { worker } = require('../../utils/mock-sw/browser');
      worker.start();
    }
  }

  const user = props.user;

  const STATS_DATA = useGraphQl('stats').data;
  const CONFIG_DATA = useGraphQl('config').data;

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
                  <div className="card-header"> Current Configuration </div>
                  <div id="config" className="card-body">
                    <CodeMirror
                      value={
                        CONFIG_DATA
                          ? CONFIG_DATA.view_configs[0].raw_config
                          : ''
                      }
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
                        return;
                      }}
                      onChange={(editor, data, value) => {
                        return;
                      }}
                    />
                    <div>
                      <span style={{ float: 'left' }}>
                        Last Update:{' '}
                        {CONFIG_DATA
                          ? CONFIG_DATA.view_configs[0].time_modified
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
                      value={
                        CONFIG_DATA ? CONFIG_DATA.view_configs[0].comment : ''
                      }
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
                        return;
                      }}
                      onChange={(editor, data, value) => {
                        return;
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
