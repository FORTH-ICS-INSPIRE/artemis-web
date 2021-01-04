import { Button } from '@material-ui/core';
import { useGraphQl } from '../../utils/hooks/use-graphql';
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
import TooltipContext from '../../context/tooltip-context';
import {
  findStatus,
  formatDate,
  genTooltip,
  getISODate,
  getSortCaret,
  getStatusField,
  isObjectEmpty,
  shallSubscribe,
} from '../../utils/token';
import Tooltip from '../tooltip/tooltip';
import ErrorBoundary from '../error-boundary/error-boundary';

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
    dataField: 'time_last',
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
      return getSortCaret(order);
    },
  },
  {
    dataField: 'time_detected',
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
      return getSortCaret(order);
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
    dataField: 'prefix',
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
    dataField: 'configured_prefix',
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
    dataField: 'type',
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
    dataField: 'hijack_as',
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
    dataField: 'rpki_status',
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
    dataField: 'num_peers_seen',
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
      return getSortCaret(order);
    },
  },
  {
    dataField: 'num_asns_inf',
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
      return getSortCaret(order);
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

function handleData(
  data,
  tooltips,
  setTooltips,
  context,
  offset,
  setFilteredHijackData
) {
  const HIJACK_DATA = data;
  let hijacks;
  if (HIJACK_DATA && HIJACK_DATA.length) {
    hijacks = HIJACK_DATA.map((row, i) => {
      const _status = findStatus(row);
      return {
        id: row.id,
        time_last: formatDate(new Date(row.time_last)),
        time_detected: formatDate(new Date(row.time_detected)),
        prefix: row.prefix,
        configured_prefix: row.configured_prefix,
        type: row.type,
        as_original: row.hijack_as,
        hijack_as: (
          <Tooltip
            tooltips={tooltips}
            setTooltips={setTooltips}
            asn={row.hijack_as}
            label={`hijack_as_` + row.id + '_' + offset}
            context={context}
          />
        ),
        status: (
          <span className={'badge badge-pill badge-' + statuses[_status[0]]}>
            {_status[0]}
          </span>
        ),
        rpki_status: row.rpki_status,
        num_peers_seen: row.num_peers_seen,
        num_asns_inf: row.num_asns_inf,
        ack:
          row.resolved || row.under_mitigation ? (
            <img alt="" src="./handled.png" />
          ) : (
              <img alt="" src="./unhadled.png" />
            ),
        more: <Link href={`/hijack?key=${row.key}`}>View</Link>,
      };
    });
  } else {
    hijacks = [];
  }

  hijacks.forEach((entry, i) => {
    entry.id = i;
  });

  setFilteredHijackData(hijacks);

  return hijacks;
}

const HijackTableComponent = (props) => {
  const { setFilteredHijackData, filter, filterStatus } = props;
  const context = React.useContext(TooltipContext);
  const [tooltips, setTooltips] = useState({});
  const [page, setPage] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [columnFilter, setColumnFilter] = useState({});
  const dateFrom: string = getISODate(filter);
  const dateTo: string = getISODate(0);
  const [limitState, setLimitState] = useState(10);
  const [offsetState, setOffsetState] = useState(0);
  const [sortState, setSortState] = useState('desc');
  const [sortColumnState, setSortColumnState] = useState('time_last');
  const [hijackData, setHijackData] = useState([]);

  const HIJACK_COUNT: any = useGraphQl('hijackCount', {
    isLive: shallSubscribe(props.isLive),
    hasColumnFilter: !isObjectEmpty(columnFilter),
    columnFilter: columnFilter,
    hasDateFilter: filter !== 0,
    dateRange: { dateTo: dateTo, dateFrom: dateFrom },
    hasStatusFilter: filterStatus ? filterStatus.length !== 0 : false,
    statusFilter:
      filterStatus && filterStatus.length !== 0
        ? `{ ${getStatusField(filterStatus)} : {_eq: true } }`
        : '',
  });

  const hijackCount = HIJACK_COUNT.data
    ? HIJACK_COUNT.data.count_data.aggregate.count
    : 0;

  useGraphQl('hijacks', {
    callback: (data) => {
      const processedData = handleData(
        shallSubscribe(props.isLive)
          ? data.subscriptionData.data.view_hijacks.slice(0, limitState)
          : data.view_hijacks.slice(0, limitState),
        tooltips,
        setTooltips,
        context,
        offsetState,
        setFilteredHijackData
      );
      setHijackData(processedData);
    },
    isLive: shallSubscribe(props.isLive),
    limits: {
      limit: limitState,
      offset: offsetState,
    },
    sortOrder: sortState,
    sortColumn: sortColumnState,
    hasDateFilter: filter !== 0,
    dateRange: { dateTo: dateTo, dateFrom: dateFrom },
    hasColumnFilter: !isObjectEmpty(columnFilter),
    columnFilter: columnFilter,
    hasStatusFilter: filterStatus ? filterStatus.length !== 0 : false,
    statusFilter:
      filterStatus && filterStatus.length !== 0
        ? `{ ${getStatusField(filterStatus)} : {_eq: true } }`
        : '',
  });

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
            className={`btn ${currSizePerPage === `${option.page}`
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
    const handleClick = async () => {
      const win = window.open(
        '/proxy_api?download_table=true&action=view_hijacks',
        '_blank'
      );
      win.focus();
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

  const handleTableChange = (
    type,
    { page, sizePerPage, sortOrder, filters, sortField }
  ) => {
    const currentIndex = page * sizePerPage;
    setPage(page);
    setSizePerPage(sizePerPage);
    setOffsetState(currentIndex);
    setLimitState(sizePerPage);
    if (sortOrder) {
      setSortColumnState(sortField);
      setSortState(sortOrder);
    }
    if (filters) setColumnFilter(filters);
  };

  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <ToolkitProvider
      keyField="id"
      columns={columns}
      data={hijackData}
      dataSize={hijackCount}
      exportCSV={{ onlyExportFiltered: true, exportAll: false }}
    >
      {(toolkitprops) => {
        paginationProps.dataSize = hijackCount;
        return (
          <>
            <div className="header-filter">
              <SizePerPageDropdownStandalone {...paginationProps} />
              <MyExportCSV {...toolkitprops.csvProps}>Export CSV!!</MyExportCSV>
            </div>
            <BootstrapTable
              remote
              wrapperClasses="table-responsive"
              keyField="id"
              data={hijackData}
              columns={columns}
              filter={filterFactory()}
              filterPosition="bottom"
              onTableChange={handleTableChange}
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
    <ErrorBoundary
      containsData={hijackCount}
      noDataMessage={'No hijack alerts.'}
      customError={HIJACK_COUNT.error}
    >
      <PaginationProvider pagination={paginationFactory(options)}>
        {contentTable}
      </PaginationProvider>
    </ErrorBoundary>
  );
};

export default HijackTableComponent;
