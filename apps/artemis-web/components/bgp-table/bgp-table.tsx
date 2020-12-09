import { Button } from '@material-ui/core';
import Link from 'next/link';
import React, { useEffect } from 'react';
import BootstrapTable, { ExpandRowProps } from 'react-bootstrap-table-next';
import filterFactory, {
  Comparator,
  selectFilter,
  textFilter,
} from 'react-bootstrap-table2-filter';
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone,
} from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import ReactTooltip from 'react-tooltip';
import { fetchASNData } from '../../utils/fetch-data';
import { parseASNData } from '../../utils/parsers';
import { genTooltip } from '../../utils/token';

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
  renderer: (row, i) => {
    return (
      <table>
        <tr>
          <td>
            <b>
              {genTooltip(
                'Prefix',
                null,
                'prefix_exp' + i,
                'The IPv4/IPv6 prefix related to the BGP update.'
              )}
            </b>
          </td>
          <td>{row.prefix.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>
              {genTooltip(
                'Origin AS',
                null,
                'origin_exp' + i,
                'The AS that originated the BGP update.'
              )}
            </b>
          </td>
          <td>{row.origin_as_original}</td>
        </tr>
        <tr>
          <td>
            <b>
              {genTooltip(
                'AS PATH',
                null,
                'path_exp' + i,
                'The AS-level path of the update.'
              )}
            </b>
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
            <b>
              {genTooltip(
                'Aux Path Information',
                null,
                'aux_exp' + i,
                'Auxiliary path information on the update/withdrawal. </br> For updates, this is different from the reported AS-PATH only in the case of AS-SETs, sequences, etc. where the monitor decomposes a single update into many for ease of interpretation. </br> For (implicit) withdrawals, it contains the original triggering BGP update information in json format.'
              )}
            </b>
          </td>
          <td>{row.orig_path ? JSON.stringify(row.orig_path) : ''}</td>
        </tr>
        <tr>
          <td>
            <b>
              {genTooltip(
                'Peer AS',
                null,
                'peer_exp' + i,
                'The monitor AS that peers with the route collector service reporting the BGP update.'
              )}
            </b>
          </td>
          <td>{row.peer_asn_original}</td>
        </tr>
        <tr>
          <td>
            <b>
              {genTooltip(
                'Service',
                null,
                'service_exp' + i,
                'The route collector service that is connected to the monitor AS that observed the BGP update.'
              )}
            </b>
          </td>
          <td>{row.service.toString().replace(/\|/g, ' -> ')}</td>
        </tr>
        <tr>
          <td>
            <b>
              {genTooltip(
                'Type',
                null,
                'type_exp' + i,
                '<ul><li>A → route announcement</li><li>W → route withdrawal</li></ul>'
              )}
            </b>
          </td>
          <td>{row.type.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>
              {genTooltip(
                'Communities',
                null,
                'communities_exp' + i,
                'BGP communities related to the BGP update.'
              )}
            </b>
          </td>
          <td>{row.communities.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>
              {genTooltip(
                'Timestamp',
                null,
                'timestamp_exp' + i,
                'The time when the BGP update was generated, as set by the BGP monitor or route collector.'
              )}
            </b>
          </td>
          <td>{row.timestamp.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>
              {genTooltip(
                'Hijack Key',
                null,
                'key_exp' + i,
                'Redirects to the hijack view if the BGP update is not benign, otherwise empty.'
              )}
            </b>
          </td>
          <td>{row.hijack_key.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>
              {genTooltip(
                'Matched Prefix',
                null,
                'matched_exp' + i,
                'The configured IPv4/IPv6 prefix that matched the hijacked prefix.'
              )}
            </b>
          </td>
          <td>{row.matched_prefix.toString()}</td>
        </tr>
        <tr>
          <td>
            <b>
              {genTooltip(
                'View Hijack',
                null,
                'view_exp' + i,
                'Redirects to the hijack view if the BGP update is not benign, otherwise empty.'
              )}
            </b>
          </td>
          <td>
            {row.hijack_key.toString().length > 0 ? (
              <Link href={`/hijack?key=${row.hijack_key}`}>View</Link>
            ) : (
              ''
            )}
          </td>
        </tr>
        <tr>
          <td>
            <b>
              {genTooltip(
                'Handled',
                null,
                'handled_exp' + i,
                'Whether the BGP update has been handled by the detection module or not.'
              )}
            </b>
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
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'timestamp_title',
        'The time when the BGP update was generated, as set by the BGP monitor or route collector.'
      ),
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
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'prefix_title',
        'The IPv4/IPv6 prefix related to the BGP update.'
      ),
    filter: exactMatchFilter,
  },
  {
    dataField: 'matched_prefix',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'matched_title',
        'The configured IPv4/IPv6 prefix that matched the hijacked prefix.'
      ),
    text: 'Matched Prefix',
    filter: exactMatchFilter,
  },
  {
    dataField: 'origin_as_original',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'origin_title',
        'The AS that originated the BGP update.'
      ),
    text: 'Origin AS',
    filter: exactMatchFilter,
  },
  {
    dataField: 'as_path',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'path_title',
        'The AS-level path of the update.'
      ),
    text: 'AS Path',
    filter: textFilter(),
  },
  {
    dataField: 'peer_asn_original',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'peer_title',
        'The monitor AS that peers with the route collector service reporting the BGP update.'
      ),
    text: 'Peer As',
    filter: exactMatchFilter,
  },
  {
    dataField: 'service',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'service_title',
        'The route collector service that is connected to the monitor AS that observed the BGP update.'
      ),
    text: 'Service',
    filter: textFilter(),
  },
  {
    dataField: 'type',
    text: 'Type',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'type_title',
        '<ul><li>A → route announcement</li><li>W → route withdrawal</li></ul>'
      ),
    filter: selectFilter({
      options: ['A', 'W'].reduce((acc, elem) => {
        acc[elem] = elem; // or what ever object you want inside
        return acc;
      }, {}),
    }),
  },
  {
    dataField: 'hijack_key',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'key_title',
        'Redirects to the hijack view if the BGP update is not benign, otherwise empty.'
      ),
    text: 'Hijack',
  },
  {
    dataField: 'handled',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'handled_title',
        'Whether the BGP update has been handled by the detection module or not.'
      ),
    text: 'Status',
  },
];

const BGPTableComponent = (props) => {
  let bgp;
  const bgpData = props.data;
  const asns = props.asns ?? [];
  const [ASNTitle, setASNTitle] = React.useState({});

  if (bgpData && bgpData.length) {
    bgp = props.data.map((row, i) => {
      const origin_as = (
        <>
          <div data-tip data-for={'origin' + i}>
            {row['origin_as']}
          </div>
          <ReactTooltip html={true} id={'origin' + i}>
            {ASNTitle[row['origin_as']] ?? 'Loading...'}
          </ReactTooltip>
        </>
      );
      const peer_as = (
        <>
          <div data-tip data-for={'peer' + i}>
            {row['peer_asn']}
          </div>
          <ReactTooltip html={true} id={'peer' + i}>
            {ASNTitle[row['peer_asn']] ?? 'Loading...'}
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
      const tooltips = {};

      for (let i = 0; i < asns.length; i++) {
        const ASN_int: number | string = asns[i];

        const [name_origin, countries_origin, abuse_origin] =
          ASN_int == '-'
            ? ['', '', '']
            : await fetchASNData(ASN_int);

        const tooltip1 =
          ASN_int == '-'
            ? ''
            : parseASNData(
                ASN_int,
                name_origin,
                countries_origin,
                abuse_origin
              );
        tooltips[ASN_int] = tooltip1;
      }

      setASNTitle(tooltips);
    })();
  }, [bgp.length]);

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} entries
    </span>
  );

  const sizePerPageRenderer = ({
    options,
    currSizePerPage,
    onSizePerPageChange,
  }) => (
    <div id="paging" className="btn-group" role="group">
      Show
      <select
        style={{ width: '80px' }}
        className="custom-select custom-select-sm form-control form-control-sm"
      >
        {options.map((option) => (
          <option
            key={option.text}
            value={option.text}
            onClick={() => onSizePerPageChange(option.page)}
            className={`btn ${
              currSizePerPage === `${option.page}`
                ? 'btn-secondary'
                : 'btn-warning'
            }`}
          >
            {option.text}
          </option>
        ))}
      </select>
      entries
    </div>
  );

  const options = {
    sizePerPageRenderer,
    pageStartIndex: 0,
    withFirstAndLast: false, // Hide the going to First and Last page button
    firstPageText: 'First',
    prePageText: 'Back',
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    showTotal: true,
    custom: true,
    hidePageListOnlyOnePage: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
      {
        text: '10',
        value: 10,
      },
      {
        text: '25',
        value: 25,
      },
      {
        text: '50',
        value: 50,
      },
      {
        text: '100',
        value: 100,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };
  const MyExportCSV = (props) => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <div>
        <Button
          className="btn btn-success"
          style={{ float: 'right', marginBottom: '10px' }}
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          Download Table
        </Button>
      </div>
    );
  };

  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <ToolkitProvider
      keyField="id"
      columns={filteredCols}
      data={bgp}
      dataSize={bgp.length}
      exportCSV={{ onlyExportFiltered: true, exportAll: false }}
    >
      {(toolkitprops) => { 
        paginationProps.dataSize = bgp.length; 
        return (
        <>
          <div className="header-filter">
            <SizePerPageDropdownStandalone {...paginationProps} />
            <MyExportCSV {...toolkitprops.csvProps}>Export CSV!!</MyExportCSV>
          </div>
          <BootstrapTable
            wrapperClasses="table-responsive"
            keyField="id"
            data={bgp}
            columns={filteredCols}
            expandRow={expandRow}
            filter={filterFactory()}
            striped
            hover
            condensed
            filterPosition="bottom"
            {...toolkitprops.baseProps}
            {...paginationTableProps}
          />
          <PaginationTotalStandalone {...paginationProps} />
          <PaginationListStandalone {...paginationProps} />
        </>
      )}}
    </ToolkitProvider>
  );

  return (
    <PaginationProvider pagination={paginationFactory(options)}>
      {contentTable}
    </PaginationProvider>
  );
};

export default BGPTableComponent;
