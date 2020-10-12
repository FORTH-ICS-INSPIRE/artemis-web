import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

let mockHijacks = [
  {
    update: 20,
    time: 'sfsf',
    hprefix: 3,
    mprefix: 3,
    type: 'fsdf',
    as: 'dsfsd',
    rpki: 'dfssd',
    peers: 3,
    ASes: 2,
    ack: 0,
    more: 'aa',
  },
  {
    update: 23,
    time: 'sfsf',
    hprefix: 3,
    mprefix: 3,
    type: 'fsdf',
    as: 'dsfsd',
    rpki: 'dfssd',
    peers: 3,
    ASes: 2,
    ack: 0,
    more: 'aa',
  },
];
const columns = [
  {
    dataField: 'update',
    text: 'Last Update',
    sort: true,
    headerTitle: () =>
      'The timestamp of the newest known (to the system) BGP update that is related to the hijack.',
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
    dataField: 'time',
    text: 'Time Detected',
    sort: true,
    headerTitle: () =>
      'The time when a hijack event was first detected by the system.',
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
    dataField: 'hprefix',
    headerTitle: () => 'The IPv4/IPv6 prefix that was hijacked.',
    text: 'Hijacked Prefix',
  },
  {
    dataField: 'mprefix',
    headerTitle: () =>
      'The configured IPv4/IPv6 prefix that matched the hijacked prefix.',
    text: 'Matched Prefix',
  },
  {
    dataField: 'type',
    headerTitle: () =>
      'The type of the hijack in 4 dimensions: prefix|path|data plane|policy<ul><li>[Prefix] S → Sub-prefix hijack</li>',
    text: 'Type',
  },
  {
    dataField: 'as',
    headerTitle: () =>
      'The AS that is potentially responsible for the hijack.</br>Note that this is an experimental field.',
    text: 'Hijacked AS',
  },
  {
    dataField: 'rpki',
    headerTitle: () => 'The RPKI status of the hijacked prefix.',
    text: 'RPKI',
  },
  {
    dataField: 'peers',
    headerTitle: () =>
      'Number of peers/monitors (i.e., ASNs)</br>that have seen hijack updates.',
    text: '# Peers Seen',
    sort: true,
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
    dataField: 'ASes',
    text: '# ASes Infected',
    headerTitle: () =>
      'Number of infected ASes that seem to</br>route traffic towards the hijacker AS.</br>Note that this is an experimental field',
    sort: true,
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
    dataField: 'ack',
    headerTitle: () =>
      'Whether the user has acknowledged/confirmed the hijack as a true positive.<br>If the resolve|mitigate buttons are pressed this<br>is automatically set to True (default value: False).',
    text: 'Ack',
  },
  {
    dataField: 'more',
    headerTitle: () => 'Further information related to the hijack.',
    text: 'More',
  },
];

const HijackTableComponent = (props) => {
  const HIJACK_DATA = props.data;
  let hijacks;
  const debug = true;

  if (HIJACK_DATA.length || !debug) {
    hijacks = HIJACK_DATA.map((row) => ({
      update: row.time_last,
      time: row.time_detected,
      hprefix: row.prefix,
      mprefix: row.configured_prefix,
      type: row.type,
      as: row.hijack_as,
      rpki: row.key,
      peers: row.num_peers_seen,
      ASes: row.num_asns_inf,
      ack: row.seen,
      more: row.comment,
    }));
  } else {
    hijacks = mockHijacks;
  }

  return <BootstrapTable keyField="update" data={hijacks} columns={columns} />;
};

export default HijackTableComponent;
