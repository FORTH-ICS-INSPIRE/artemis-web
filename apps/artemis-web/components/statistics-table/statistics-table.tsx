import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';

type IndexType = {
  view_index_all_stats: {
    monitored_prefixes: number;
    configured_prefixes: number;
    monitor_peers: number;
    total_bgp_updates: number;
    total_unhandled_updates: number;
    total_hijacks: number;
    ignored_hijacks: number;
    resolved_hijacks: number;
    withdrawn_hijacks: number;
    mitigation_hijacks: number;
    ongoing_hijacks: number;
    dormant_hijacks: number;
    acknowledged_hijacks: number;
    outdated_hijacks: number;
  }[];
};

type StatisticsType = {
  data: IndexType;
};

class StatisticsTable extends Component<StatisticsType, unknown> {
  render() {
    const STATISTICS_DATA = this.props.data;
    const tooltips = [
      'The total number of IPv4/IPv6 prefixes that are actually monitored (super-prefixes include sub-prefixes).',
      'The total number of IPv4/IPv6 prefixes that are configured (as appearing in ARTEMIS rules).',
      'The total number of monitors (ASNs) that peer with routing collector services, as observed by the system.',
      'The total number of BGP updates seen on the monitors.',
      'The total number of BGP updates not processed by the detection (either because they are in the queue, or because the detection was not running when they were fed to the monitors).',
      'The total number of hijack events stored in the system.',
      'The number of ignored hijack events (that were marked by the user).',
      'The number of resolved hijack events (that were marked by the user).',
      'The number of withdrawn hijack events.',
      'The number of hijack events that are currently under mitigation (triggered by the user).',
      'The number of ongoing hijack events (not ignored or resolved or withdrawn or outdated).',
      'The number of dormant hijack events (ongoing, but not updated within the last X hours).',
      'The number of acknowledged hijack events (confirmed as true positives).',
      'The number of hijack events that are currently outdated (matching deprecated configurations, but benign now).',
    ];

    return (
      <table id="modules" className="table table-hover">
        <tbody>
          {STATISTICS_DATA && STATISTICS_DATA.view_index_all_stats ? (
            Object.entries(STATISTICS_DATA.view_index_all_stats[0]).map(
              (stat, i) => {
                let firstCaps = '';
                stat[0]
                  .split('_')
                  .forEach(
                    (word) =>
                      (firstCaps =
                        firstCaps +
                        word.charAt(0).toUpperCase() +
                        word.slice(1) +
                        ' ')
                  );

                if (firstCaps.includes('Typename')) return;

                return (
                  <tr key={i}>
                    <td>
                      <div data-tip data-for={'stats' + i}>
                        {firstCaps}
                      </div>
                      <ReactTooltip html={true} id={'stats' + i}>
                        {tooltips[i]}
                      </ReactTooltip>
                    </td>
                    <td>{stat[1]}</td>
                  </tr>
                );
              }
            )
          ) : (
            <tr></tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default StatisticsTable;
