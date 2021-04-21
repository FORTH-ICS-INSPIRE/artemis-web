import { Button } from '@material-ui/core';
import { useStyles } from '../../utils/styles';
import fetch from 'cross-fetch';
import React, { useEffect, useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { formatDate } from '../../utils/token';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/3024-day.css';

type stateType = {
  configs: any[];
  currentConfigLeft: string;
  currentConfigRight: string;
  currentCommentLeft: string;
  currentCommentRight: string;
};

const SystemConfigurationComponent = (props) => {
  const configRef = React.createRef<any>();
  const commentRef = React.createRef<any>();
  const [alertState, setAlertState] = useState('none');
  const [editState, setEditState] = useState(false);
  const [configState, setConfigState] = useState('');
  const [commentState, setCommentState] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const CONFIG_DATA = props.CONFIG_DATA;

  useEffect(() => {
    if (CONFIG_DATA && CONFIG_DATA.view_configs[0]) {
      setConfigState(CONFIG_DATA.view_configs[0].raw_config.toString());
      setCommentState(CONFIG_DATA.view_configs[0].comment);
    }
  }, [CONFIG_DATA]);

  async function onClick(e, action) {
    e.preventDefault();
    if (action === 'save') {
      setEditState(!editState);
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

  const classes = useStyles();
  require('codemirror/mode/yaml/yaml');

  return (
    <>
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
                    className={classes.inactiveButton}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setEditState(!editState)}
                    style={{ float: 'right', marginRight: '5px' }}
                    variant="contained"
                    className={classes.cancelButton}
                  >
                    cancel
                  </Button>{' '}
                </>
              ) : (
                <Button
                  onClick={() => setEditState(!editState)}
                  style={{ float: 'right' }}
                  variant="contained"
                  className="material-button"
                >
                  Edit
                </Button>
              )}
              <Button
                onClick={(e) => onClick(e, 'load')}
                style={{ float: 'right', marginRight: '10px' }}
                variant="contained"
                className="material-button"
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
                  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                  theme: '3024-day',
                  lineNumbers: true,
                }}
                onBeforeChange={(editor, data, value) => {
                  if (editState) setConfigState(value);
                }}
              />
              <div style={{ marginTop: '4px' }}>
                <span style={{ float: 'left' }}>
                  Last Update:{' '}
                  {CONFIG_DATA
                    ? formatDate(
                      new Date(CONFIG_DATA.view_configs[0].time_modified),
                      2
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
                  mode: 'text',
                  styleActiveLine: true,
                  foldGutter: true,
                  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                  theme: '3024-day',
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
    </>
  );
};

export default SystemConfigurationComponent;
