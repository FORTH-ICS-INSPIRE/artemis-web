import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {
  textFilter,
  Comparator,
  selectFilter,
} from 'react-bootstrap-table2-filter';
import paginationFActory from 'react-bootstrap-table2-paginator';

const exactMatchFilter = textFilter({
  placeholder: '', // custom the input placeholder
  className: 'my-custom-text-filter', // custom classname on input
  defaultValue: '', // default filtering value
  comparator: Comparator.EQ, // default is Comparator.LIKE
  caseSensitive: true, // default is false, and true will only work when comparator is LIKE
  style: {}, // your custom styles on input
  delay: 1000, // how long will trigger filtering after user typing, default is 500 ms
  id: 'id', // assign a unique value for htmlFor attribute, it's useful when you have same dataField across multiple table in one page
});

const selectType = {
  0: 'E',
  1: '0',
  2: '-',
};

const selectRPKI = {
  0: 'VD',
  1: 'IA',
  2: 'IL',
  3: 'IU',
  4: 'NF',
  5: 'NA',
};

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
    dataField: 'status',
    headerTitle: () =>
      'The status of a hijack event (possible values: ongoing|dormant|withdrawn|under mitigation|ignored|resolved|outdated).',
    text: 'Status',
  },
  {
    dataField: 'hprefix',
    headerTitle: () => 'The IPv4/IPv6 prefix that was hijacked.',
    text: 'Hijacked Prefix',
    filter: exactMatchFilter,
  },
  {
    dataField: 'mprefix',
    headerTitle: () =>
      'The configured IPv4/IPv6 prefix that matched the hijacked prefix.',
    text: 'Matched Prefix',
    filter: exactMatchFilter,
  },
  {
    dataField: 'type',
    headerTitle: () =>
      'The type of the hijack in 4 dimensions: prefix|path|data plane|policy<ul><li>[Prefix] S → Sub-prefix hijack</li>',
    text: 'Type',
    formatter: (cell) => selectType[cell],
    filter: selectFilter({
      options: selectType,
    }),
  },
  {
    dataField: 'as',
    headerTitle: () =>
      'The AS that is potentially responsible for the hijack.</br>Note that this is an experimental field.',
    text: 'Hijacked AS',
    filter: exactMatchFilter,
  },
  {
    dataField: 'rpki',
    headerTitle: () => 'The RPKI status of the hijacked prefix.',
    text: 'RPKI',
    formatter: (cell) => selectRPKI[cell],
    filter: selectFilter({
      options: selectRPKI,
    }),
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

  if (HIJACK_DATA && HIJACK_DATA.length) {
    hijacks = HIJACK_DATA.map((row) => ({
      update: row.time_last,
      time: row.time_detected,
      hprefix: row.prefix,
      mprefix: row.configured_prefix,
      type: row.type,
      status: row.status,
      as: row.hijack_as,
      rpki: row.key,
      peers: row.num_peers_seen,
      ASes: row.num_asns_inf,
      ack: row.seen,
      more: <a href={'/hijack?key=' + row.key}>View</a>,
    }));
  } else {
    hijacks = [];
  }

  return (
    <BootstrapTable
      keyField="update"
      data={hijacks}
      columns={columns}
      filter={filterFactory()}
      filterPosition="bottom"
      pagination={paginationFActory({ sizePerPage: 10 })}
    />
  );
};

export default HijackTableComponent;
