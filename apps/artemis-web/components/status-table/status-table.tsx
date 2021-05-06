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
  monitorModules: any;

  constructor(props) {
    super(props);
    this.state = { date: new Date() };
    this.monitorModules = [
      'bgpstreamhisttap',
      'bgpstreamkafkatap',
      'bgpstreamlivetap',
      'exabgptap',
      'riperistap',
    ];
  }

  componentDidMount(): void {
    this._isMounted = true;

    setInterval(
      () => (this._isMounted ? this.setState({ date: new Date() }) : ''),
      1000
    );
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  render() {
    const STATS_DATA = this.props.data;
    const modulesSet = {};
    const processes = [...new Set(STATS_DATA.view_processes)];

    processes.forEach((module) => {
      const modName = module.name.substring(0, module.name.indexOf('-'));
      if (modName in modulesSet) {
        modulesSet[modName].push([
          module.name,
          module.running,
          module.timestamp,
        ]);
      } else {
        modulesSet[modName] = [[module.name, module.running, module.timestamp]];
      }
    });
    const monitorModules = this.monitorModules;
    let monitor = processes.filter((module) =>
      monitorModules.includes(
        module.name.substring(0, module.name.indexOf('-'))
      )
    );
    let backend = processes.filter(
      (module) =>
        !monitorModules.includes(
          module.name.substring(0, module.name.indexOf('-'))
        )
    );

    monitor = monitor.sort(function (a, b) {
      const keyA = a.name,
        keyB = b.name;

      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    backend = backend.sort(function (a, b) {
      const keyA = a.name,
        keyB = b.name;

      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });

    const tooltips = {
      autoignore:
        'Backend microservice that automatically ignores hijack alerts of low impact and/or visibility based on user configuration.',
      autostarter:
        'Backend microservice that automatically checks the health of the backend and monitor (taps) microservices and activates them via their REST interface in case they are down.',
      notifier:
        'Backend microservice that sends BGP hijack alerts to different logging endpoints, according to user configuration.',
      fileobserver:
        'Backend microservice that detects content changes in the configuration file and notifies configuration.',
      prefixtree:
        'Backend microservice that holds the configuration prefix tree (prefixes bundled with ARTEMIS rules) in-memory for quick lookups.',
      riperistap:
        'Monitor/tap microservice that collects real-time BGP update information from RIPE RIS live.',
      exabgptap:
        'Monitor/tap microservice that collects real-time BGP update information from local BGP feeds via exaBGP.',
      bgpstreamlivetap:
        'Monitor/tap microservice that collects real-time BGP update information from RIPE RIS RIB collections, RouteViews RIB collections and Public CAIDA BMP feeds.',
      bgpstreamkafkatap:
        'Monitor/tap microservice that collects real-time BGP update information via Kafka from public and private BMP feeds.',
      bgpstreamhisttap:
        'Monitor/tap microservice that replays historical BGP updates.',
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

    const backList = [];
    const monitorList = [];

    return (
      <>
        <h5>Backend Microservices</h5>
        <table id="modules" className="table table-hover">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Name</th>
              <th style={{ textAlign: 'left' }}>Status</th>
              <th style={{ textAlign: 'left' }}>Uptime</th>
            </tr>
          </thead>
          <tbody>
            {STATS_DATA && backend ? (
              backend.map((process, i) => {
                if (
                  !backList.includes(
                    process.name.slice(0, process.name.indexOf('-'))
                  )
                ) {
                  backList.push(
                    process.name.slice(0, process.name.indexOf('-'))
                  );

                  return (
                    <ModuleState
                      key={i} // React requires a unique key value for each component rendered within a loop
                      process={process}
                      modules={modulesSet}
                      index={i}
                      tooltip={
                        tooltips[
                          process.name.slice(0, process.name.indexOf('-'))
                        ]
                      }
                      date={this.state.date}
                    ></ModuleState>
                  );
                }
              })
            ) : (
              <tr></tr>
            )}
          </tbody>
        </table>

        <h5>Monitor (tap) Microservices</h5>
        <table id="modules" className="table table-hover">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Name</th>
              <th style={{ textAlign: 'left' }}>Status</th>
              <th style={{ textAlign: 'left' }}>Uptime</th>
            </tr>
          </thead>
          <tbody>
            {STATS_DATA && monitor ? (
              monitor.map((process, i) => {
                if (
                  !monitorList.includes(
                    process.name.slice(0, process.name.indexOf('-'))
                  )
                ) {
                  monitorList.push(
                    process.name.slice(0, process.name.indexOf('-'))
                  );

                  return (
                    <ModuleState
                      key={i + '2'}
                      process={process}
                      modules={modulesSet}
                      index={i + '2'}
                      tooltip={
                        tooltips[
                          process.name.slice(0, process.name.indexOf('-'))
                        ]
                      }
                      date={this.state.date}
                    ></ModuleState>
                  );
                }
              })
            ) : (
              <tr></tr>
            )}
          </tbody>
        </table>
      </>
    );
  }
}

export default StatusTable;
