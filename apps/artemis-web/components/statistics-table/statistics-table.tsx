import React, { Component } from 'react';

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

class StatisticsTable extends Component<StatisticsType, {}> {
  render() {
    const STATISTICS_DATA = this.props.data;

    return (
      <table id="modules" className="table table-hover">
        <tbody>
          {STATISTICS_DATA && STATISTICS_DATA.view_index_all_stats ? (
            Object.entries(STATISTICS_DATA.view_index_all_stats[0]).map(
              (stat, i) => {
                return (
                  <tr key={i}>
                    <td>{stat[0]}</td>
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
