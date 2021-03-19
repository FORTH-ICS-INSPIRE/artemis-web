import { Button, withStyles } from '@material-ui/core';
import { styles } from '../../utils/styles';
import DMP from 'diff_match_patch';
import React, { Component } from 'react';
import { sendData } from '../../utils/fetch-data';

type stateType = {
  configs: any[];
  currentConfigLeft: string;
  currentConfigRight: string;
  currentCommentLeft: string;
  currentCommentRight: string;
};

class LearnRuleComponent extends Component<
  { hijack: any; config: any; classes: any },
  stateType
> {
  CodeMirror: any;
  _ref: any;
  config: any;
  hijack: any;

  constructor(props) {
    super(props);
    this.config = props.config;
    this.hijack = props.hijack;

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
    };
  }

  async learnRule(e) {
    const { key, prefix, type, hijack_as } = this.hijack;
    const reqData = {
      hijack_key: key,
      hijack_as: hijack_as,
      type_: type,
      prefix: prefix,
      action: 'approve',
    };

    await fetch('/api/hijack', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    });

    window.location.reload();
    return true;
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
      const learnedRule = `  LEARNED_H_${key}_P_${dashedPrefix}: &LEARNED_H_${key}_P_${dashedPrefix}\n  - ${prefix}\n`;
      const configRight =
        config.substring(0, config.indexOf('monitors:')) +
        learnedRule +
        config.substring(config.indexOf('monitors:'), config.length);

      this.CodeMirror.MergeView(this._ref, {
        theme: '3024-day',
        value: config,
        origLeft: null,
        origRight: configRight,
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
            <div className="row">
              <div className="col-lg-6">Old configuration</div>
              <div className="col-lg-6">New configuration</div>
            </div>
            <div ref={(ref) => (this._ref = ref)}></div>
            <div className="row" style={{ marginTop: '20px' }}>
              <div className="col-lg-6" />
              <div className="col-lg-6">
                <Button
                  className={classes.cancelButton}
                  style={{ float: 'right', marginLeft: '10px' }}
                  variant="contained"
                  // color="secondary"
                  onClick={async (e) => {
                    await sendData(e, {
                      hijackKeys: [this.hijack.key],
                      state: true,
                      selectState: 'ignore',
                    });
                    window.location.reload();
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
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LearnRuleComponent);
