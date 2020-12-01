import { fetchASNData } from '../../utils/fetch-data';
import { parseASNData } from '../../utils/parsers';
import React, { useEffect } from 'react';
import BootstrapTable, { ExpandRowProps } from 'react-bootstrap-table-next';
import filterFactory, {
  Comparator,
  selectFilter,
  textFilter,
} from 'react-bootstrap-table2-filter';
import paginationFActory from 'react-bootstrap-table2-paginator';
import { formatDate } from '../../utils/token';

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
            <b>Hijacked Prefix:</b>
          </td>
          <td>{row.hprefix.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>Matched Prefix:</b>
          </td>
          <td>{row.mprefix.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>Type:</b>
          </td>
          <td>{row.type}</td>
        </tr>
        <tr>
          <td>
            <b>RPKI:</b>
          </td>
          <td>{row.rpki.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>Type:</b>
          </td>
          <td>{row.type.toString()}</td>
        </tr>
        <tr>
          <td>
            <b># Peers Seen</b>
          </td>
          <td>{row.peers.toString()}</td>
        </tr>
        <tr>
          <td>
            <b># ASes Infected:</b>
          </td>
          <td>{row.ASes.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>ACK:</b>
          </td>
          <td>
            {row.resolved || row.under_mitigation ? (
              <img alt="" src="./handled.png" />
            ) : (
              <img alt="" src="./unhadled.png" />
            )}
          </td>
        </tr>
      </table>
    );
  },
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
    filter: textFilter(),
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
    filter: selectFilter({
      options: ['VD', 'IA', 'IL', 'IU', 'NF', 'NA'].reduce((acc, elem) => {
        acc[elem] = elem; // or what ever object you want inside
        return acc;
      }, {}),
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
];

const OngoingHijackTableComponent = (props) => {
  const HIJACK_DATA = props.data;
  let hijacks;
  const [ASNTitle, setASNTitle] = React.useState([]);

  if (HIJACK_DATA && HIJACK_DATA.length) {
    hijacks = HIJACK_DATA.map((row, i) => {
      return {
        update: formatDate(new Date(row.time_last)),
        time: formatDate(new Date(row.time_detected)),
        hprefix: row.prefix,
        mprefix: row.configured_prefix,
        type: row.type,
        as_original: row.hijack_as,
        as: (
          <div data-toggle="tooltip" title={ASNTitle[i]}>
            {row.hijack_as}
          </div>
        ),
        rpki: row.rpki_status,
        peers: row.num_peers_seen,
        ASes: row.num_asns_inf,
        ack:
          row.resolved || row.under_mitigation ? (
            <img alt="" src="./handled.png" />
          ) : (
            <img alt="" src="./unhadled.png" />
          ),
      };
    });
  } else {
    hijacks = [];
  }

  useEffect(() => {
    (async function setStateFn() {
      const tooltips = [];
      for (let i = 0; i < hijacks.length; i++) {
        if (hijacks.length < ASNTitle.length) return;
        const ASN_int: number = hijacks[i].as_original;
        const [name, countries, abuse] = await fetchASNData(ASN_int);

        const tooltip = parseASNData(ASN_int, name, countries, abuse);
        tooltips.push(tooltip);
      }
      if (JSON.stringify(tooltips) !== JSON.stringify(ASNTitle))
        setASNTitle(tooltips);
    })();
  }, [hijacks]);

  return (
    <BootstrapTable
      keyField="update"
      data={hijacks}
      columns={columns}
      expandRow={expandRow}
      filter={filterFactory()}
      filterPosition="bottom"
      pagination={paginationFActory({ sizePerPage: 10 })}
    />
  );
};

export default OngoingHijackTableComponent;
