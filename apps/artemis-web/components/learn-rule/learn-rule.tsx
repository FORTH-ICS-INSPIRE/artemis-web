import { Button, withStyles } from '@material-ui/core';
import { styles } from '../../utils/styles';
import DMP from 'diff_match_patch';
import React, { Component } from 'react';
import { sendHijackData } from '../../utils/fetch-data';

type stateType = {
  configs: any[];
  currentConfigLeft: string;
  currentConfigRight: string;
  currentCommentLeft: string;
  currentCommentRight: string;
  isConfigSuccess: boolean;
  configMessage: string;
  success: boolean;
};

class LearnRuleComponent extends Component<
  { hijack: any; config: any; classes: any },
  stateType
> {
  CodeMirror: any;
  _ref: any;
  config: any;
  hijack: any;
  mergeView: any;
  _csrf: string;

  constructor(props) {
    super(props);
    this.config = props.config;
    this.hijack = props.hijack;
    this._csrf = props._csrf;

    if (
      typeof window !== 'undefined' &&
      typeof window.navigator !== 'undefined'
    ) {
      this.CodeMirror = require('codemirror/lib/codemirror');
      require('codemirror/lib/codemirror.css');
      require('codemirror/theme/eclipse.css');
      require('codemirror/theme/neat.css');
      require('codemirror/addon/lint/lint.css');
      require('codemirror/addon/merge/merge.css');
      require('codemirror/mode/javascript/javascript');
      require('codemirror/addon/lint/lint');
      require('codemirror/addon/lint/javascript-lint');
      require('codemirror/addon/merge/merge');
      require('codemirror/mode/yaml/yaml');
      require('codemirror/theme/3024-day.css');
    }

    this.state = {
      configs: [],
      currentConfigLeft: '',
      currentCommentLeft: '',
      currentConfigRight: '',
      currentCommentRight: '',
      isConfigSuccess: false,
      configMessage: '',
      success: false,
    };
  }

  async getConfig() {
    const { key, prefix, type, hijack_as } = this.hijack;
    const reqData = {
      hijack_key: key,
      hijack_as: hijack_as,
      type_: type,
      prefix: prefix,
      action: 'show',
      _csrf: this._csrf,
    };

    const res = await fetch('/api/hijack', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    });

    const config = await res.json();
    this.setState({
      configMessage: config.new_yaml_conf,
      isConfigSuccess: config.success,
    });

    if (config.success)
      this.mergeView.rightOriginal().doc.setValue(config.new_yaml_conf);
    this.mergeView.edit.setValue(this.state.currentConfigLeft);
  }

  async learnRule(e) {
    const _csrf = this._csrf;
    const { key, prefix, type, hijack_as } = this.hijack;
    const reqData = {
      hijack_key: key,
      hijack_as: hijack_as,
      type_: type,
      prefix: prefix,
      action: 'approve',
      _csrf: _csrf
    };

    const hijack_resp = await fetch('/api/hijack', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    });

    await sendHijackData(e, {
      hijackKey: key,
      selectState: 'hijack_action_ignore',
      prefix: prefix,
      hijack_as: hijack_as,
      type: type,
      _csrf: _csrf,
    });

    const hijack_resp_message = await hijack_resp.json();

    this.setState({
      isConfigSuccess: false,
      success: hijack_resp_message.success,
      configMessage: hijack_resp_message.success ? 'Rule successfully installed!' : hijack_resp_message.configMessage,
    });
  }

  async componentDidMount() {
    if (
      typeof window !== 'undefined' &&
      typeof window.navigator !== 'undefined'
    ) {
      Object.keys(DMP).forEach((key) => {
        window[key] = DMP[key];
      });

      const key = this.hijack.key;
      const prefix: string = this.hijack.prefix;
      const dashedPrefix = prefix.replace(/\./g, '_').replace('/', '_');

      const config: string = this.config.data.view_configs[0].raw_config;
      this.getConfig();

      this.setState({ currentConfigLeft: config });

      this.mergeView = this.CodeMirror.MergeView(this._ref, {
        theme: '3024-day',
        value: this.state.currentConfigLeft,
        origLeft: null,
        origRight: this.state.currentConfigRight,
        allowEditingOriginals: true,
        lineNumbers: true,
        mode: 'yaml',
        highlightDifferences: true,
        gutters: ['CodeMirror-lint-markers'],
        lint: true,
        connect: 'align',
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="row">
        <div className="card" style={{ width: '100%' }}>
          <div className="card-header"> </div>
          <div className="card-body">
            <div className={this.state.isConfigSuccess ? 'row' : 'disappear'}>
              <div className="col-lg-6">Old configuration</div>
              <div className="col-lg-6">New configuration</div>
            </div>
            <div
              className={this.state.isConfigSuccess ? '' : 'disappear'}
              ref={(ref) => (this._ref = ref)}
            ></div>
            <div
              className={this.state.isConfigSuccess ? 'row' : 'disappear'}
              style={{ marginTop: '20px' }}
            >
              <div className="col-lg-6" />
              <div className="col-lg-6">
                <Button
                  className={classes.cancelButton}
                  style={{ float: 'right', marginLeft: '10px' }}
                  variant="contained"
                  // color="secondary"
                  onClick={async (e) => {
                    await sendHijackData(e, {
                      hijackKey: this.hijack.key,
                      selectState: 'hijack_action_ignore',
                      prefix: this.hijack.prefix,
                      hijack_as: this.hijack.hijack_as,
                      type: this.hijack.type,
                      _csrf: this._csrf,
                    });
                    this.setState({
                      isConfigSuccess: false,
                      success: true,
                      configMessage:
                        'Hijack ignored with no additional change!',
                    });
                  }}
                >
                  Procceed with no change
                </Button>
                <Button
                  className={classes.button}
                  style={{ float: 'right', marginBottom: '10px' }}
                  variant="contained"
                  // color="primary"
                  onClick={(e) => this.learnRule(e)}
                >
                  Add rule
                </Button>
              </div>
            </div>
            {!this.state.isConfigSuccess && (
              <div style={{ color: !this.state.success ? 'red' : 'green' }}>
                {' '}
                {this.state.configMessage
                  ? this.state.configMessage.toUpperCase()
                  : ''}{' '}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LearnRuleComponent);
