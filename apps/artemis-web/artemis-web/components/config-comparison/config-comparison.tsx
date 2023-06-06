import { formatDate } from '../../utils/token';
import DMP from 'diff_match_patch';
import React, { Component } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import fetch from 'cross-fetch';

type stateType = {
  configs: any[];
  currentConfigLeft: string;
  currentConfigRight: string;
  currentCommentLeft: string;
  currentCommentRight: string;
};

class ConfigComparisonComponent extends Component<unknown, stateType> {
  CodeMirror: any;
  _ref: any;
  mergeView: any;
  constructor(props) {
    super(props);
    if (
      typeof window !== 'undefined' &&
      typeof window.navigator !== 'undefined'
    ) {
      this.CodeMirror = require('codemirror/lib/codemirror');
      require('codemirror/lib/codemirror.css');
      require('codemirror/theme/3024-day.css');
      require('codemirror/theme/eclipse.css');
      require('codemirror/theme/neat.css');
      require('codemirror/addon/lint/lint.css');
      require('codemirror/addon/merge/merge.css');
      require('codemirror/mode/javascript/javascript');
      require('codemirror/addon/lint/lint');
      require('codemirror/addon/lint/javascript-lint');
      require('codemirror/addon/merge/merge');
      require('codemirror/mode/yaml/yaml');
    }

    this.state = {
      configs: [],
      currentConfigLeft: '',
      currentCommentLeft: '',
      currentConfigRight: '',
      currentCommentRight: '',
    };
  }

  async componentDidMount() {
    if (
      typeof window !== 'undefined' &&
      typeof window.navigator !== 'undefined'
    ) {
      Object.keys(DMP).forEach((key) => {
        window[key] = DMP[key];
      });

      const res = await fetch(
        `${document.location.protocol}//${document.location.host}/api/configs`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const configs = await res.json();

      this.setState({ configs: configs.configs });
      this.setState({
        currentConfigLeft: this.state.configs[0].raw_config,
        currentCommentLeft: this.state.configs[0].comment,
      });
      this.setState({
        currentConfigRight: this.state.configs[0]?.raw_config,
        currentCommentRight: this.state.configs[0]?.comment,
      });

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

  handleOptions(key, position) {
    if (position === 'left') {
      this.setState({
        currentConfigLeft: this.state.configs[key].raw_config,
        currentCommentLeft: this.state.configs[key].comment,
      });
      this.mergeView.edit.setValue(this.state.configs[key].raw_config);
    } else {
      this.setState({
        currentConfigRight: this.state.configs[key].raw_config,
        currentCommentRight: this.state.configs[key].comment,
      });
      this.mergeView
        .rightOriginal()
        .doc.setValue(this.state.configs[key].raw_config);
    }
  }

  render() {
    return (
      <>
        <div className="row">
          <div className="card" style={{ width: '100%' }}>
            <div className="card-header"> </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-6">
                  Select config: <br />
                  <select
                    onChange={(e) => this.handleOptions(e.target.value, 'left')}
                    style={{ marginBottom: '10px' }}
                  >
                    {this.state.configs.map((config, i) => {
                      return (
                        <option value={i} key={i}>
                          {formatDate(new Date(config.time_modified), Math.abs(new Date().getTimezoneOffset() / 60))}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-lg-6">
                  <span style={{ marginLeft: '50px' }}>Select config:</span>{' '}
                  <br />
                  <select
                    onChange={(e) =>
                      this.handleOptions(e.target.value, 'right')
                    }
                    style={{ marginLeft: '50px' }}
                  >
                    {this.state.configs.map((config, i) => {
                      return (
                        <option value={i} key={i}>
                          {formatDate(new Date(config.time_modified), Math.abs(new Date().getTimezoneOffset() / 60))}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div ref={(ref) => (this._ref = ref)}></div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="card" style={{ width: '100%' }}>
            <div className="card-header"> Configuration comments </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-6">
                  <CodeMirror
                    value={this.state.currentCommentLeft}
                    options={{
                      mode: 'yaml',
                      styleActiveLine: true,
                      foldGutter: true,
                      readonly: true,
                      gutters: [
                        'CodeMirror-linenumbers',
                        'CodeMirror-foldgutter',
                      ],
                      theme: '3024-day',
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
                <div className="col-lg-6">
                  <CodeMirror
                    value={this.state.currentCommentRight}
                    options={{
                      mode: 'text',
                      styleActiveLine: true,
                      foldGutter: true,
                      readonly: true,
                      gutters: [
                        'CodeMirror-linenumbers',
                        'CodeMirror-foldgutter',
                      ],
                      theme: '3024-day',
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
      </>
    );
  }
}

export default ConfigComparisonComponent;
