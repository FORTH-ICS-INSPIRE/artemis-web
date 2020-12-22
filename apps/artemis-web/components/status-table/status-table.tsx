import React, { Component } from 'react';
import ModuleState from '../module-state/module-state';

type ProcessType = {
  view_processes: { name: string; running: boolean; timestamp: number }[];
};

type StatsType = {
  data: ProcessType;
};

class StatusTable extends Component<StatsType, any> {
  _isMounted: boolean;

  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this._isMounted = true;

    setInterval(
      () => (this._isMounted ? this.setState({ date: new Date() }) : ''),
      1000
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
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
            <th style={{ textAlign: 'left' }}>Module</th>
            <th style={{ textAlign: 'left' }}>Status</th>
            <th style={{ textAlign: 'left' }}>Uptime</th>
          </tr>
        </thead>
        <tbody>
          {STATS_DATA && STATS_DATA ? (
            STATS_DATA.view_processes.map((process, i) => {
              return (
                <ModuleState
                  key={i}
                  process={process}
                  index={i}
                  tooltip={
                    tooltips[process.name.slice(0, process.name.indexOf('-'))]
                  }
                  date={this.state.date}
                ></ModuleState>
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
