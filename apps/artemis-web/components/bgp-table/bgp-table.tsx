import React from 'react';
import BootstrapTable, { ExpandRowProps } from 'react-bootstrap-table-next';
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

const expandRow: ExpandRowProps<any, number> = {
  showExpandColumn: true,
  expandByColumnOnly: true,
  expandColumnPosition: 'right',
  renderer: (row) => {
    return (
      <table>
        <tr>
          <td>
            <b>Prefix:</b>
          </td>
          <td>{row.prefix.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>Origin AS:</b>
          </td>
          <td>{row.origin_as.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>AS Path:</b>
          </td>
          <td>
            {row.as_path
              ? JSON.stringify(row.as_path)
                  .replace(/,/g, ' ')
                  .replace(/\[/g, '')
                  .replace(/\]/g, '')
              : ''}
          </td>
        </tr>
        <tr>
          <td>
            <b>Aux Path Information:</b>
          </td>
          <td>{row.orig_path ? JSON.stringify(row.orig_path) : ''}</td>
        </tr>
        <tr>
          <td>
            <b>Peer AS:</b>
          </td>
          <td>{row.peer_asn.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>Service:</b>
          </td>
          <td>{row.service.toString().replace(/\|/g, ' -> ')}</td>
        </tr>
        <tr>
          <td>
            <b>Type:</b>
          </td>
          <td>{row.type.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>Communities:</b>
          </td>
          <td>{row.communities.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>Timestamp:</b>
          </td>
          <td>{row.timestamp.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>Hijack Key:</b>
          </td>
          <td>{row.hijack_key.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>Matched Prefix:</b>
          </td>
          <td>{row.matched_prefix.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>View Hijack:</b>
          </td>
          <td>
            <a href={'/hijack?key=' + row.hijack_key}>View</a>
          </td>
        </tr>
        <tr>
          <td>
            <b>Handled:</b>
          </td>
          <td>{row.handled}</td>
        </tr>
      </table>
    );
  },
};

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
    filter: exactMatchFilter,
  },
  {
    dataField: 'matched_prefix',
    headerTitle: () => 'The IPv4/IPv6 prefix that was hijacked.',
    text: 'Matched Prefix',
    filter: exactMatchFilter,
  },
  {
    dataField: 'origin_as',
    headerTitle: () => 'The AS that originated the BGP update.',
    text: 'Origin AS',
    filter: exactMatchFilter,
  },
  {
    dataField: 'as_path',
    headerTitle: () => 'The AS-level path of the update.',
    text: 'AS Path',
    filter: textFilter(),
  },
  {
    dataField: 'peer_asn',
    headerTitle: () =>
      'The route collector service that is connected to the monitor AS that observed the BGP update.',
    text: 'Peer As',
    filter: exactMatchFilter,
  },
  {
    dataField: 'service',
    headerTitle: () =>
      'The route collector service that is connected to the monitor AS that observed the BGP update.',
    text: 'Service',
    filter: textFilter(),
  },
  {
    dataField: 'type',
    text: 'Type',
    headerTitle: () =>
      '<ul><li>A → route announcement</li><li>W → route withdrawal</li></ul>',
    filter: selectFilter({
      options: ['A', 'W'].reduce((acc, elem) => {
        acc[elem] = elem; // or what ever object you want inside
        return acc;
      }, {}),
    }),
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
];

const BGPTableComponent = (props) => {
  const bgp = props.data;
  const skippedCols = props.skippedCols ?? [];

  const filteredCols = columns.filter(
    (col) => !skippedCols.includes(col.dataField)
  );

  return (
    <BootstrapTable
      keyField="timestamp"
      data={bgp}
      columns={filteredCols}
      expandRow={expandRow}
      filter={filterFactory()}
      filterPosition="bottom"
      pagination={paginationFActory({ sizePerPage: 10 })}
    />
  );
};

export default BGPTableComponent;
