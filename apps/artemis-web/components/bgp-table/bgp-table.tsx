import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

const mockBGP = [
  {
    timestamp: 20,
    prefix: 'sfsf',
    matched: 3,
    mprefix: 3,
    origin: 'fsdf',
    path: 'dsfsd',
    peer: 'dfssd',
    peers: 3,
    service: 2,
    type: 0,
    hijack: 9,
    status: '',
    more: 'aa',
  },
  {
    timestamp: 10,
    prefix: 'aa',
    matched: 3,
    mprefix: 3,
    origin: 'aa',
    path: 'dsd',
    peer: 'dfssd',
    peers: 3,
    service: 2,
    type: 0,
    hijack: 9,
    status: '',
    more: 'aa',
  },
];
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
  const filteredDate = new Date();
  const filter = props.filter;

  filteredDate.setHours(filteredDate.getHours() - filter);

  const bgp = props.data ?? mockBGP;

  const filteredBgp =
    filter !== 0
      ? bgp.filter((entry) => new Date(entry.timestamp) >= filteredDate)
      : bgp;
  return (
    <BootstrapTable
      keyField="timestamp"
      data={filteredBgp}
      columns={columns}
    />
  );
};

export default BGPTableComponent;
