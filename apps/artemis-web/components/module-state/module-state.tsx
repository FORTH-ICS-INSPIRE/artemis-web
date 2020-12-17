import { Button } from '@material-ui/core';
import { diffDate } from '../../utils/token';
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';

class ModuleState extends Component<any, any> {
  render() {
    const { process, index, tooltip, date } = this.props;

    return (
      <tr key={index}>
        <td>
          <div data-tip data-for={'module' + index}>
            {process
              ? process.name.charAt(0).toUpperCase() + process.name.slice(1)
              : ''}
          </div>
          <ReactTooltip html={true} id={'module' + index}>
            {tooltip ?? 'Loading...'}
          </ReactTooltip>
        </td>
        <td>
          {process ? (
            process.running ? (
              <Button variant="contained" color="primary">
                On
              </Button>
            ) : (
              <Button variant="contained" color="secondary">
                Off
              </Button>
            )
          ) : (
            ''
          )}
        </td>
        <td>
          {process
            ? process.running
              ? diffDate(new Date(process.timestamp), date)
              : '-'
            : ''}
        </td>
      </tr>
    );
  }
}

export default ModuleState;
