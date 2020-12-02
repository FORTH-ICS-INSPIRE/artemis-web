import { fetchASNData } from '../../utils/fetch-data';
import { parseASNData } from '../../utils/parsers';
import React, { useEffect } from 'react';
import BootstrapTable, { ExpandRowProps } from 'react-bootstrap-table-next';
import filterFactory, {
  textFilter,
  Comparator,
  selectFilter,
} from 'react-bootstrap-table2-filter';
import paginationFActory from 'react-bootstrap-table2-paginator';
import ReactTooltip from 'react-tooltip';
import Link from 'next/link';

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
          <td>{row.origin_as_original}</td>
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
                  .replace(/\"/g, '')
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
          <td>{row.peer_asn_original}</td>
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
            {row.hijack_key.toString().length > 0 ? (
              <Link href={`/hijack?key=${row.hijack_key}`}>
                <a href={'/hijack?key=' + row.hijack_key}>View</a>
              </Link>
            ) : (
              ''
            )}
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
    dataField: 'origin_as_original',
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
    dataField: 'peer_asn_original',
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
  let bgp;
  const bgpData = props.data;
  const [ASNTitle, setASNTitle] = React.useState([]);

  if (bgpData && bgpData.length) {
    bgp = props.data.map((row, i) => {
      const origin_as = (
        <>
          <div data-tip data-for={'origin' + i}>
            {row['origin_as']}
          </div>
          <ReactTooltip html={true} id={'origin' + i}>
            {ASNTitle[i] ? ASNTitle[i][0] : ''}
          </ReactTooltip>
        </>
      );
      const peer_as = (
        <>
          <div data-tip data-for={'peer' + i}>
            {row['peer_asn']}
          </div>
          <ReactTooltip html={true} id={'peer' + i}>
            {ASNTitle[i] ? ASNTitle[i][1] : ''}
          </ReactTooltip>
        </>
      );
      row.as_path = JSON.stringify(row.as_path)
        .replace(/,/g, ' ')
        .replace(/\[/g, '')
        .replace(/\]/g, '')
        .replace(/\"/g, '');
      return {
        ...row,
        origin_as_original: origin_as,
        peer_asn_original: peer_as,
      };
    });
  } else {
    bgp = [];
  }

  const skippedCols = props.skippedCols ?? [];

  const filteredCols = columns.filter(
    (col) => !skippedCols.includes(col.dataField)
  );

  useEffect(() => {
    (async function setStateFn() {
      const tooltips = [];

      for (let i = 0; i < bgp.length; i++) {
        const ASN_int_origin: number = bgp[i].origin_as;
        const ASN_int_peer: number = bgp[i].peer_asn;
        const [
          name_origin,
          countries_origin,
          abuse_origin,
        ] = await fetchASNData(ASN_int_origin);
        const [name_peer, countries_peer, abuse_peer] = await fetchASNData(
          ASN_int_peer
        );
        const tooltip1 = parseASNData(
          ASN_int_origin,
          name_origin,
          countries_origin,
          abuse_origin
        );
        const tooltip2 = parseASNData(
          ASN_int_peer,
          name_peer,
          countries_peer,
          abuse_peer
        );

        tooltips.push([tooltip1, tooltip2]);
      }

      if (JSON.stringify(tooltips) !== JSON.stringify(ASNTitle))
        setASNTitle(tooltips);
    })();
  }, [bgp]);

  return (
    <BootstrapTable
      wrapperClasses="table-responsive"
      keyField="timestamp"
      data={bgp}
      columns={columns}
      expandRow={expandRow}
      filter={filterFactory()}
      filterPosition="bottom"
      pagination={paginationFActory({ sizePerPage: 10 })}
    />
  );
};

export default BGPTableComponent;
