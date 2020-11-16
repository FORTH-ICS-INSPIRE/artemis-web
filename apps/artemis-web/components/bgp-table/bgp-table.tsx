import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: 'timestamp',
    text: 'Timestamp',
    sort: true,
    headerTitle: () =>
      'The time when the BGP update was generated, as set by the BGP monitor or route collector.',
    sortCaret: (order) => {
      if (!order)
        return (
          <span>
            &nbsp;&nbsp;&darr;
            <span style={{ color: 'red' }}>/&uarr;</span>
          </span>
        );
      if (order === 'asc')
        return (
          <span>
            &nbsp;&nbsp;&darr;
            <span style={{ color: 'red' }}>/&uarr;</span>
          </span>
        );
      if (order === 'desc')
        return (
          <span>
            &nbsp;&nbsp;
            <span style={{ color: 'red' }}>&darr;</span>
            /&uarr;
          </span>
        );
      return null;
    },
  },
  {
    dataField: 'prefix',
    text: 'Prefix',
    headerTitle: () => 'The IPv4/IPv6 prefix related to the BGP update.',
  },
  {
    dataField: 'matched_prefix',
    headerTitle: () => 'The IPv4/IPv6 prefix that was hijacked.',
    text: 'Matched Prefix',
  },
  {
    dataField: 'origin_as',
    headerTitle: () => 'The AS that originated the BGP update.',
    text: 'Origin AS',
  },
  {
    dataField: 'as_path',
    headerTitle: () => 'The AS-level path of the update.',
    text: 'AS Path',
  },
  {
    dataField: 'peer_asn',
    headerTitle: () =>
      'The route collector service that is connected to the monitor AS that observed the BGP update.',
    text: 'Peer As',
  },
  {
    dataField: 'service',
    headerTitle: () =>
      'The route collector service that is connected to the monitor AS that observed the BGP update.',
    text: 'Service',
  },
  {
    dataField: 'type',
    text: 'Type',
    headerTitle: () =>
      '<ul><li>A → route announcement</li><li>W → route withdrawal</li></ul>',
  },
  {
    dataField: 'hijack_key',
    headerTitle: () =>
      'Redirects to the hijack view if the BGP update is not benign, otherwise empty.',
    text: 'Hijack',
  },
  {
    dataField: 'handled',
    headerTitle: () =>
      'Whether the BGP update has been handled by the detection module or not.',
    text: 'Status',
  },
  {
    dataField: 'more',
    headerTitle: () => 'Further information related to the BGP update.',
    text: 'More',
  },
];

const BGPTableComponent = (props) => {
  const bgp = props.data;

  return <BootstrapTable keyField="timestamp" data={bgp} columns={columns} />;
};

export default BGPTableComponent;
