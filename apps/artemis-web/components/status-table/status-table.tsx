import { Button } from '@material-ui/core';
import { diffDate } from '../../utils/token';
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';

type ProcessType = {
  view_processes: { name: string; running: boolean; timestamp: number }[];
};

type StatsType = {
  data: ProcessType;
};

class StatusTable extends Component<StatsType, any> {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    setInterval(() => this.setState({ date: new Date() }), 1000);
  }
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
                  <td>
                    <div data-tip data-for={'module' + i}>
                      {process.name.charAt(0).toUpperCase() +
                        process.name.slice(1)}
                    </div>
                    <ReactTooltip html={true} id={'module' + i}>
                      {tooltips[process.name] ?? ''}
                    </ReactTooltip>
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
                      ? diffDate(new Date(process.timestamp), this.state.date)
                      : '-'}
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
