import { Button } from '@material-ui/core';
import React, { Component } from 'react';

type ProcessType = {
  view_processes: { name: string; running: boolean; timestamp: number }[];
};

type StatsType = {
  data: ProcessType;
};

class StatusTable extends Component<StatsType, {}> {
  render() {
    const STATS_DATA = this.props.data;
    const tooltips = {
      clock:
        'ARTEMIS module serving as the clock signal generator for periodic tasks done in other modules (e.g., database).',
      configuration:
        'ARTEMIS module responsible for the configuration of the other ARTEMIS modules.',
      database:
        'ARTEMIS module responsible for providing access to the Postgres DB used in the core of ARTEMIS for persistent storage of configuration, BGP update and BGP prefix hijack event data.',
      detection:
        'ARTEMIS module responsible for the detection of hijack events.',
      mitigation:
        'ARTEMIS module responsible for the manual or automated mitigation of hijack events (current support for manual mitigation or via the invocation of a custom operator-supplied script).',
      monitor:
        'ARTEMIS module responsible for real-time monitoring of BGP updates appearing on the visible control plane of public and local BGP monitors (current support for RIPE RIS, BGPStream RouteViews, RIPE RIS and beta BMP, local exaBGP monitors, historical trace replay).',
      observer:
        'ARTEMIS module responsible for observing async changes in the configuration file, triggering the reloading of ARTEMIS modules.',
    };

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
                  <td
                    data-toggle="tooltip"
                    data-placement="top"
                    title={tooltips[process.name]}
                  >
                    {process.name.charAt(0).toUpperCase() +
                      process.name.slice(1)}
                  </td>
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

export default StatusTable;
