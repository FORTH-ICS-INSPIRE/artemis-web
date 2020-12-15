import { Button } from '@material-ui/core';
import TooltipContext from '../../context/tooltip-context';
import Link from 'next/link';
import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
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
import { fetchTooltip } from '../../utils/fetch-data';
import { formatDate, genTooltip } from '../../utils/token';

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

const columns = [
  {
    dataField: 'update',
    text: 'Last Update',
    sort: true,
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'update_title',
        'The timestamp of the newest known (to the system) BGP update that is related to the hijack.'
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
    dataField: 'time',
    text: 'Time Detected',
    sort: true,
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'time_title',
        'The time when a hijack event was first detected by the system'
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
    dataField: 'status',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'status_title',
        'The status of a hijack event (possible values: ongoing|dormant|withdrawn|under mitigation|ignored|resolved|outdated).'
      ),
    text: 'Status',
  },
  {
    dataField: 'hprefix',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'hprefix_title',
        'The IPv4/IPv6 prefix that was hijacked'
      ),
    text: 'Hijacked Prefix',
    filter: exactMatchFilter,
  },
  {
    dataField: 'mprefix',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'mprefix_title',
        'The configured IPv4/IPv6 prefix that matched the hijacked prefix.'
      ),
    text: 'Matched Prefix',
    filter: exactMatchFilter,
  },
  {
    dataField: 'htype',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'htype_title',
        'The type of the hijack in 4 dimensions: prefix|path|data plane|policy<ul><li>[Prefix] S → Sub-prefix hijack</li>'
      ),
    text: 'Type',
    filter: textFilter(),
  },
  {
    dataField: 'as',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'as_title',
        'The AS that is potentially responsible for the hijack.</br>Note that this is an experimental field.'
      ),
    text: 'Hijacked AS',
    filter: exactMatchFilter,
  },
  {
    dataField: 'rpki',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'rpki_title',
        'The RPKI status of the hijacked prefix.'
      ),
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
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'peers_title',
        'Number of peers/monitors (i.e., ASNs)</br>that have seen hijack updates.'
      ),
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
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'ASes_title',
        'Number of infected ASes that seem to</br>route traffic towards the hijacker AS.</br>Note that this is an experimental field'
      ),
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
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'ack_title',
        'Whether the user has acknowledged/confirmed the hijack as a true positive.<br>If the resolve|mitigate buttons are pressed this<br>is automatically set to True (default value: False).'
      ),
    text: 'Ack',
  },
  {
    dataField: 'more',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'more_title',
        'Further information related to the hijack.'
      ),
    text: 'More',
  },
];

const statuses = {
  Ongoing: 'danger',
  Dormant: 'secondary',
  Resolved: 'success',
  Ignored: 'warning',
  'Under Mitigation': 'primary',
  Withdrawn: 'info',
  Outdated: 'dark',
};

const HijackTableComponent = (props) => {
  const HIJACK_DATA = props.data;
  let hijacks;
  const context = React.useContext(TooltipContext);
  const [tooltips, setTooltips] = useState({});

  if (HIJACK_DATA && HIJACK_DATA.length) {
    hijacks = HIJACK_DATA.map((row, i) => ({
      id: row.id,
      update: formatDate(new Date(row.time_last)),
      time: formatDate(new Date(row.time_detected)),
      hprefix: row.prefix,
      mprefix: row.configured_prefix,
      htype: row.type,
      status: (
        <span className={'badge badge-pill badge-' + statuses[row.status]}>
          {row.status}
        </span>
      ),
      as_original: row.hijack_as,
      as: (
        <>
          <div
            onMouseOver={() =>
              fetchTooltip(row.hijack_as, context, {
                tooltips: tooltips,
                setTooltips: setTooltips,
              })
            }
            data-tip
            data-for={'hijack_as'}
          >
            {row.hijack_as}
          </div>
          <ReactTooltip html={true} id={'hijack_as'}>
            {tooltips[row.hijack_as] ?? 'Loading...'}
          </ReactTooltip>
        </>
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
      more: <Link href={`/hijack?key=${row.key}`}>View</Link>,
    }));
  } else {
    hijacks = [];
  }

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
      columns={columns}
      data={hijacks}
      exportCSV={{ onlyExportFiltered: true, exportAll: false }}
    >
      {(toolkitprops) => {
        paginationProps.dataSize = hijacks.length;
        return (
          <>
            <div className="header-filter">
              <SizePerPageDropdownStandalone {...paginationProps} />
              <MyExportCSV {...toolkitprops.csvProps}>Export CSV!!</MyExportCSV>
            </div>
            <BootstrapTable
              wrapperClasses="table-responsive"
              keyField="id"
              data={hijacks}
              columns={columns}
              filter={filterFactory()}
              filterPosition="bottom"
              striped
              condensed
              hover
              {...toolkitprops.baseProps}
              {...paginationTableProps}
            />

            <PaginationTotalStandalone {...paginationProps} />
            <PaginationListStandalone {...paginationProps} />
          </>
        );
      }}
    </ToolkitProvider>
  );

  return (
    <PaginationProvider pagination={paginationFactory(options)}>
      {contentTable}
    </PaginationProvider>
  );
};

export default HijackTableComponent;
