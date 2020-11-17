import { Button } from '@material-ui/core';
import React, { Component } from 'react';

type ProcessType = {
  view_processes: { name: string; running: boolean; timestamp: number }[];
};

type StatsType = {
  data: ProcessType;
};

class StatsTable extends Component<StatsType, {}> {
  render() {
    const STATS_DATA = this.props.data;

    return (
      <table id="modules" className="table table-hover">
        <thead>
          <tr>
            <th>Module</th>
            <th>Status</th>
            <th>Uptime</th>
          </tr>
        </thead>
        <tbody>
          {STATS_DATA && STATS_DATA ? (
            STATS_DATA.view_processes.map((process, i) => {
              return (
                <tr key={i}>
                  <td>{process.name}</td>
                  <td>
                    {process.running ? (
                      <Button variant="contained" color="primary">
                        On
                      </Button>
                    ) : (
                      <Button variant="contained" color="secondary">
                        Off
                      </Button>
                    )}
                  </td>
                  <td>
                    {process.running
                      ? new Date().getHours() -
                        new Date(process.timestamp).getHours() +
                        'h'
                      : '0h'}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr></tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default StatsTable;
