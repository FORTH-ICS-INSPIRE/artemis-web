import Link from 'next/link';
import React, { useState } from 'react';
import { ReactElement } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {
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
import { useGraphQl } from '../../utils/hooks/use-graphql';
import {
  formatDate,
  getSortCaret,
  isObjectEmpty,
  shallSubscribe,
  getExactMatchFilter,
  genTooltip,
  compareObjects,
  isNumeric,
} from '../../utils/token';
import ErrorBoundary from '../error-boundary/error-boundary';
import ExportJSON from '../export-json/export-json';
import Tooltip from '../tooltip/tooltip';
import Image from 'next/image';

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
        'last_update_title',
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
        'time_detected_title',
        'The time when a hijack event was first detected by the system.'
      ),
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
  {
    dataField: 'prefix',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'hprefix_title',
        'The IPv4/IPv6 prefix that was hijacked.'
      ),
    text: 'Hijacked Prefix',
    filter: getExactMatchFilter(stateValues['prefix'], 'Prefix'),
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
        'type_title',
        'The type of the hijack in 4 dimensions: prefix|path|data plane|policy<ul><li>[Prefix] S → Sub-prefix hijack</li>'
      ),
    text: 'Type',
    filter: textFilter({
      defaultValue: stateValues['type'],
      placeholder: 'Type',
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
    text: 'Hijacked AS',
    filter: getExactMatchFilter(stateValues['hijack_as'], 'Hijacked AS'),
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

function handleData(data, tooltips, setTooltips, context, offset) {
  const HIJACK_DATA = data;
  let hijacks;

  if (HIJACK_DATA && HIJACK_DATA.length) {
    hijacks = HIJACK_DATA.map((row, i) => {
      return {
        id: i,
        time_last: formatDate(new Date(row.time_last), Math.abs(new Date().getTimezoneOffset() / 60)),
        time_detected: formatDate(new Date(row.time_detected), Math.abs(new Date().getTimezoneOffset() / 60)),
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
        rpki_status: row.rpki_status,
        num_peers_seen: row.num_peers_seen,
        num_asns_inf: row.num_asns_inf,
        ack: row.seen ? (
          <Image alt="" src="./handled.png" />
        ) : (
          <Image alt="" src="./unhadled.png" />
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

  return hijacks;
}

const OngoingHijackTableComponent = (props: any): ReactElement => {
  const [hijackData, setHijackData] = useState([]);
  const context = React.useContext(TooltipContext);
  const [tooltips, setTooltips] = useState({});
  const [page, setPage] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [columnFilter, setColumnFilter] = useState({});
  const [limitState, setLimitState] = useState(10);
  const [offsetState, setOffsetState] = useState(0);
  const [sortState, setSortState] = useState('desc');
  const [sortColumnState, setSortColumnState] = useState('time_last');
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
    hasDateFilter: false,
    statusFilter: '{ active : {_eq: true } }, { dormant : {_eq: false}}',
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
        offsetState
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
    hasDateFilter: false,
    hasColumnFilter: !isObjectEmpty(columnFilter),
    columnFilter: columnFilter,
    statusFilter: '{ active : {_eq: true } }, { dormant : {_eq: false}}',
  });

  const exportFilters = {
    hasColumnFilter: !isObjectEmpty(columnFilter),
    columnFilter: columnFilter,
    hasDateFilter: false,
    hasStatusFilter: true,
    statusFilter: 'active.eq.true,dormant.eq.false',
  };

  const _csrf = props._csrf;

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
    <div
      style={{ marginBottom: '10px' }}
      id="paging"
      className="btn-group"
      role="group"
    >
      Show
      <select
        style={{ width: '80px', marginLeft: '10px', marginRight: '10px' }}
        onChange={(event) =>
          onSizePerPageChange(parseInt(event.target.value, 10))
        }
        className="custom-select custom-select-sm form-control form-control-sm"
      >
        {options.map((option, i) => (
          <option
            key={i}
            value={option.text}
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
    page: page,
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    showTotal: true,
    custom: true,
    dataSize: hijackCount,
    sizePerPage: sizePerPage,
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

  const handleTableChange = (
    type,
    { page, sizePerPage, sortOrder, filters, sortField }
  ) => {
    const currentIndex = page * sizePerPage;
    setPage(page);
    setSizePerPage(sizePerPage);

    if (currentIndex) setOffsetState(currentIndex);

    if (sizePerPage) setLimitState(sizePerPage);

    if (sortOrder) {
      setSortColumnState(sortField);
      setSortState(sortOrder);
    }
    if (filters) {
      const keys = Object.keys(filters);

      keys.forEach((key) => {
        if (filters[key])
          setStateValues({
            ...stateValues,
            [key]: isNumeric(filters[key].filterVal)
              ? filters[key].filterVal
              : -1,
          });
        else setStateValues({ ...stateValues, [key]: '' });
      });

      if (currentIndex && !compareObjects(filters, columnFilter)) {
        setPage(0);
        setOffsetState(0);
      }

      setColumnFilter(filters);
    }
  };

  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <ToolkitProvider
      keyField="id"
      columns={getColumns(stateValues)}
      data={hijackData}
      exportCSV={{ onlyExportFiltered: true, exportAll: false }}
    >
      {(toolkitprops) => {
        paginationProps.dataSize = hijackCount;
        return (
          <>
            <div style={{ marginBottom: '10px' }} className="header-filter">
              <div className="row">
                <div className="col-lg-12">
                  <ExportJSON
                    action="view_hijacks"
                    dateField={'time_last'}
                    exportFilters={exportFilters}
                    _csrf={_csrf}
                    {...toolkitprops.csvProps}
                  >
                    Export JSON!!
                  </ExportJSON>
                </div>
              </div>
              <div className="row" style={{ marginTop: '10px' }}>
                <div className="col-lg-12">
                  <div style={{ float: 'left' }}>
                    <SizePerPageDropdownStandalone {...paginationProps} />
                  </div>
                  <div style={{ float: 'right' }}>
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
              // expandRow={getExpandRow(expandState)}
              filter={filterFactory()}
              onTableChange={handleTableChange}
              filterPosition="top"
              striped
              hover
              noDataIndication={() => {
                return (
                  <div>
                    <p>
                      <Image
                        alt=""
                        id="nodata"
                        width="256"
                        height="256"
                        src="/checkmark.png"
                      />
                    </p>
                    <h3>{'No hijack alerts! Go grab a beer!'}</h3>
                  </div>
                );
              }}
              {...toolkitprops.baseProps}
              {...paginationTableProps}
            />
            <div className="row">
              <div className="col-lg-12">
                <div style={{ float: 'right' }}>
                  <PaginationListStandalone {...paginationProps} />
                </div>
                <div style={{ float: 'left' }}>
                  <PaginationTotalStandalone {...paginationProps} />
                </div>
              </div>
            </div>
          </>
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

export default OngoingHijackTableComponent;
