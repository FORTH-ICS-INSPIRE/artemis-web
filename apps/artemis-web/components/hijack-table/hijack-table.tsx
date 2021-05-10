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
  compareObjects,
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
import { sendData } from '../../utils/fetch-data';
import { useStyles } from '../../utils/styles';
import ExportJSON from '../export-json/export-json';

const getExactMatchFilter = (stateValue, fieldName) =>
  textFilter({
    placeholder: fieldName, // custom the input placeholder
    className: 'my-custom-text-filter', // custom classname on input
    defaultValue: stateValue, // default filtering value
    comparator: Comparator.EQ, // default is Comparator.LIKE
    caseSensitive: true, // default is false, and true will only work when comparator is LIKE
    style: {}, // your custom styles on input
    delay: 1000, // how long will trigger filtering after user typing, default is 500 ms
    id: 'id', // assign a unique value for htmlFor attribute, it's useful when you have same dataField across multiple table in one page
  });

const getColumns = (stateValues) => [
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
    filter: getExactMatchFilter(stateValues['prefix'], 'Hijacked Prefix'),
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
    filter: getExactMatchFilter(
      stateValues['configured_prefix'],
      'Matched Prefix'
    ),
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
    filter: textFilter({
      placeholder: 'Type',
      defaultValue: stateValues['type'],
    }),
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
    text: 'Hijacker AS',
    filter: getExactMatchFilter(stateValues['hijack_as'], 'Hijacker AS'),
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
      placeholder: 'RPKI',
      defaultValue: stateValues['rpki_status'],
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
        id: i,
        time_last: formatDate(new Date(row.time_last), 3),
        time_detected: formatDate(new Date(row.time_detected), 3),
        prefix: row.prefix,
        configured_prefix: row.configured_prefix,
        type: row.type,
        as_original: row.hijack_as,
        hijack_as:
          row.hijack_as === -1 ? (
            <span>-</span>
          ) : (
            <Tooltip
              tooltips={tooltips}
              setTooltips={setTooltips}
              asn={row.hijack_as}
              label={`hijack_as_` + i + '_' + offset}
              context={context}
            />
          ),
        status: (
          <>
            {_status.map((status) => (
              <span className={'badge badge-pill badge-' + statuses[status]}>
                {status}
              </span>
            ))}
          </>
        ),
        rpki_status: row.rpki_status,
        num_peers_seen: row.num_peers_seen,
        num_asns_inf: row.num_asns_inf,
        ack: row.seen ? (
          <img alt="" src="./handled.png" />
        ) : (
          <img alt="" src="./unhadled.png" />
        ),
        key: row.key,
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
  const {
    setFilteredHijackData,
    filter,
    filterStatus,
    filterTo,
    _csrf,
  } = props;
  const context = React.useContext(TooltipContext);
  const [tooltips, setTooltips] = useState({});
  const [page, setPage] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [columnFilter, setColumnFilter] = useState({});
  const dateFrom: string = getISODate(filter);
  const dateTo: string = getISODate(filterTo ?? 0);
  const [limitState, setLimitState] = useState(10);
  const [offsetState, setOffsetState] = useState(0);
  const [sortState, setSortState] = useState('desc');
  const [sortColumnState, setSortColumnState] = useState('time_last');
  const [hijackData, setHijackData] = useState([]);
  const [hijackState, setHijackState] = useState([]);
  const [selectState, setSelectState] = useState('hijack_action_resolve');
  const [stateValues, setStateValues] = useState({
    prefix: '',
    configured_prefix: '',
    hijack_as: '',
    rpki_status: '',
    type: '',
  });

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
        style={{ width: '80px', marginLeft: '10px', marginRight: '10px' }}
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

  const pageButtonRenderer = ({ page, active, onPageChange }) => {
    const handleClick = (e) => {
      e.preventDefault();
      onPageChange(page);
    };

    return (
      <li key={page} className={(active ? 'active' : '') + ' page-item'}>
        <a onClick={handleClick} href="#" className="page-link">
          {page !== 'Next' && page !== 'Back' ? page + 1 : page}
        </a>
      </li>
    );
  };

  const options = {
    pageButtonRenderer,
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
    page: page,
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


  const HijackActions = (props) => {
    const data = props.data;
    const { hijackState, setHijackState, selectState, setSelectState } = props;

    return (
      <>
        <button
          onClick={() => setHijackState(data)}
          style={{ marginRight: '5px' }}
          id="select_page"
          type="button"
          className="btn btn-primary btn-sm"
        >
          Select Page
        </button>
        <span
          style={{ marginRight: '5px' }}
          className="btn-group-toggle"
          data-toggle="buttons"
        >
          <label className="btn btn-secondary active btn-sm">
            <input type="checkbox" autoComplete="off" /> Selected Hijacks{' '}
            <b id="selected_hijacks_num">{hijackState.length}</b>
          </label>
        </span>
        <select
          onChange={(e) => setSelectState(e.target.value)}
          style={{
            width: '200px',
            display: 'inline-block',
            marginRight: '5px',
          }}
          className="form-control form-control-sm-auto"
          id="action_selection"
        >
          <option value="hijack_action_resolve">Mark as Resolved</option>
          <option value="hijack_action_ignore">Mark as Ignored</option>
          <option value="hijack_action_acknowledge">
            Mark as Acknowledged
          </option>
          <option value="hijack_action_acknowledge_not">
            Mark as Not Acknowledged
          </option>
          <option value="hijack_action_delete">Delete Hijack</option>
        </select>
        <button
          onClick={(e) =>
            sendData(e, {
              hijackKeys: hijackState.map((hijack) => hijack.key),
              selectState: selectState,
              _csrf: props._csrf,
            })
          }
          style={{ marginRight: '5px' }}
          id="apply_selected"
          type="button"
          className="btn btn-primary btn-sm"
        >
          Apply
        </button>
        <button
          onClick={() => setHijackState([])}
          id="clear_all_selected"
          type="button"
          className="btn btn-danger btn-sm"
        >
          Clear
        </button>
      </>
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
    if (filters) {
      const keys = Object.keys(filters);

      keys.forEach((key) => {
        if (filters[key])
          setStateValues({ ...stateValues, [key]: filters[key].filterVal });
        else setStateValues({ ...stateValues, [key]: '' });
      });

      if (currentIndex && !compareObjects(filters, columnFilter)) {
        setPage(0);
        setOffsetState(0);
      }

      setColumnFilter(filters);
    }
  };

  const tableRowEvents = {
    onClick: (e, row, rowIndex) => {
      const existsInState = hijackState.some(
        (hijack) => hijack.key === row.key
      );

      if (existsInState)
        setHijackState(hijackState.filter((hijack) => hijack.key !== row.key));
      else setHijackState(hijackState.concat([row]));
    },
  };

  const rowClasses = (row, rowIndex) =>
    hijackState.some((hijack) => hijack.key === row.key) ? 'highlight-row' : '';

  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <ToolkitProvider
      keyField="id"
      columns={getColumns(stateValues)}
      data={hijackData}
      dataSize={hijackCount}
      exportCSV={{ onlyExportFiltered: true, exportAll: false }}
    >
      {(toolkitprops) => {
        paginationProps.dataSize = hijackCount;
        return (
          <div>
            <div className="header-filter">
              <div className="row" style={{ marginBottom: "5px" }}>
                <div className="col-lg-12">
                  <ExportJSON action="view_hijacks" _csrf={_csrf} {...toolkitprops.csvProps}>Export CSV!!</ExportJSON>
                  <HijackActions
                    _csrf={_csrf}
                    data={hijackData}
                    hijackState={hijackState}
                    setHijackState={setHijackState}
                    selectState={selectState}
                    setSelectState={setSelectState}
                  />
                </div>
              </div>
              <div className="row" style={{ marginBottom: "10px" }}>
                <div className="col-lg-12">
                  <div style={{ float: "left" }}>
                    <SizePerPageDropdownStandalone {...paginationProps} />
                  </div>
                  <div style={{ float: "right" }}>
                    <PaginationTotalStandalone {...paginationProps} />
                    <PaginationListStandalone {...paginationProps} />
                  </div>
                </div>
              </div>
            </div>
            <BootstrapTable
              remote
              wrapperClasses="table-responsive"
              keyField="id"
              data={hijackData}
              columns={getColumns(stateValues)}
              filter={filterFactory()}
              filterPosition="top"
              onTableChange={handleTableChange}
              striped
              condensed
              hover
              rowClasses={rowClasses}
              rowEvents={tableRowEvents}
              noDataIndication={() => {
                return (
                  <div>
                    <p>
                      <img
                        alt=""
                        id="nodata"
                        width="256"
                        src="checkmark.png"
                      ></img>
                    </p>
                    <h3>{'No hijack alerts! Go grab a beer!'}</h3>
                  </div>
                );
              }}
              {...toolkitprops.baseProps}
              {...paginationTableProps}
            />
          </div>
        );
      }}
    </ToolkitProvider>
  );

  return (
    <ErrorBoundary
      containsData={true}
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
