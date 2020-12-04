import React, { Component } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import DMP from 'diff_match_patch';

class ConfigComparisonComponent extends Component<{}, {}> {
  CodeMirror: any;
  _ref: any;
  constructor(props) {
    super(props);
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
    }
  }

  componentDidMount() {
    if (
      typeof window !== 'undefined' &&
      typeof window.navigator !== 'undefined'
    ) {
      Object.keys(DMP).forEach((key) => {
        window[key] = DMP[key];
      });
      const origin = '',
        target = '';

      this.CodeMirror.MergeView(this._ref, {
        theme: 'material',
        value: origin,
        origLeft: null,
        origRight: target,
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
    return (
      <>
        <div className="row">
          <div className="card" style={{ width: '100%' }}>
            <div className="card-header"> </div>
            <div className="card-body">
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
                    value={'fsdfs'}
                    options={{
                      mode: 'yaml',
                      styleActiveLine: true,
                      foldGutter: true,
                      readonly: true,
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
                <div className="col-lg-6">
                  <CodeMirror
                    value={'121'}
                    options={{
                      mode: 'yaml',
                      styleActiveLine: true,
                      foldGutter: true,
                      readonly: true,
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
      </>
    );
  }
}

export default ConfigComparisonComponent;
