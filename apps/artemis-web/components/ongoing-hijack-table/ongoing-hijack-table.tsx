import { Button } from '@material-ui/core';
import React, { useState } from 'react';
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
import TooltipContext from '../../context/tooltip-context';
import { useGraphQl } from '../../utils/hooks/use-graphql';
import {
  formatDate,
  getSortCaret,
  isObjectEmpty,
  shallSubscribe,
} from '../../utils/token';
import ErrorBoundary from '../error-boundary/error-boundary';
import Tooltip from '../tooltip/tooltip';

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
        <thead></thead>
        <tbody>
          <tr>
            <td>
              <b>
                <div data-tip data-for={'hprefix_exp'}>
                  {<span>{'Hijacked Prefix'}</span>}
                </div>
                <ReactTooltip html={true} id={'hprefix_exp'}>
                  {'The IPv4/IPv6 prefix that was hijacked.'}
                </ReactTooltip>
              </b>
            </td>
            <td>{row.prefix.toString()}</td>
          </tr>
          <tr>
            <td>
              <b>
                <div data-tip data-for={'mprefix_exp'}>
                  {<span>{'Hijacked Prefix'}</span>}
                </div>
                <ReactTooltip html={true} id={'mprefix_exp'}>
                  {
                    'The configured IPv4/IPv6 prefix that matched the hijacked prefix.'
                  }
                </ReactTooltip>
              </b>
            </td>
            <td>{row.configured_prefix.toString()}</td>
          </tr>
          <tr>
            <td>
              <b>
                <div data-tip data-for={'type_exp'}>
                  {<span>{'Type'}</span>}
                </div>
                <ReactTooltip html={true} id={'type_exp'}>
                  {
                    'The type of the hijack in 4 dimensions: prefix|path|data plane|policy.'
                  }
                </ReactTooltip>
              </b>
            </td>
            <td>{row.type}</td>
          </tr>
          <tr>
            <td>
              <b>
                <div data-tip data-for={'rpki_exp'}>
                  {<span>{'RPKI'}</span>}
                </div>
                <ReactTooltip html={true} id={'rpki_exp'}>
                  {'The RPKI status of the hijacked prefix.'}
                </ReactTooltip>
              </b>
            </td>
            <td>{row.rpki_status.toString()}</td>
          </tr>
          <tr>
            <td>
              <b>
                <div data-tip data-for={'seen_exp'}>
                  {<span>{'# Peers Seen'}</span>}
                </div>
                <ReactTooltip html={true} id={'seen_exp'}>
                  {
                    'Number of peers/monitors (i.e., ASNs)<br>that have seen hijack updates.'
                  }
                </ReactTooltip>
              </b>
            </td>
            <td>{row.num_peers_seen.toString()}</td>
          </tr>
          <tr>
            <td>
              <b>
                <div data-tip data-for={'inf_exp'}>
                  {<span>{'# ASes Infected'}</span>}
                </div>
                <ReactTooltip html={true} id={'inf_exp'}>
                  {
                    'Number of infected ASes that seem to<br>route traffic towards the hijacker AS.<br>Note that this is an experimental field.'
                  }
                </ReactTooltip>
              </b>
            </td>
            <td>{row.num_asns_inf.toString()}</td>
          </tr>
          <tr>
            <td>
              <b>
                <div data-tip data-for={'ack_exp'}>
                  {<span>{'ACK'}</span>}
                </div>
                <ReactTooltip html={true} id={'ack_exp'}>
                  {
                    'Whether the user has acknowledged/confirmed the hijack as a true positive.<br>If the resolve|mitigate buttons are pressed this<br>is automatically set to True (default value: False).'
                  }
                </ReactTooltip>
              </b>
            </td>
            <td>
              {row.resolved || row.under_mitigation ? (
                <img alt="" src="./handled.png" />
              ) : (
                <img alt="" src="./unhadled.png" />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
};

const columns = [
  {
    dataField: 'time_last',
    text: 'Last Update',
    sort: true,
    headerTitle: false,
    headerFormatter: (column, colIndex, components) => (
      <>
        <div data-tip data-for={'last_update_title'}>
          {
            <span>
              {column.text} {components.sortElement}
            </span>
          }
        </div>
        <ReactTooltip html={true} id={'last_update_title'}>
          {
            'The timestamp of the newest known (to the system) BGP update that is related to the hijack.'
          }
        </ReactTooltip>
      </>
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
    headerFormatter: (column, colIndex, components) => (
      <>
        <div data-tip data-for={'time_detected_title'}>
          {
            <span>
              {column.text} {components.sortElement}
            </span>
          }
        </div>
        <ReactTooltip html={true} id={'time_detected_title'}>
          {'The time when a hijack event was first detected by the system.'}
        </ReactTooltip>
      </>
    ),
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
  {
    dataField: 'prefix',
    headerTitle: false,
    headerFormatter: (column, colIndex) => (
      <>
        <div data-tip data-for={'hprefix_title'}>
          {column.text}
        </div>
        <ReactTooltip html={true} id={'hprefix_title'}>
          {'The IPv4/IPv6 prefix that was hijacked.'}
        </ReactTooltip>
      </>
    ),
    text: 'Hijacked Prefix',
    filter: exactMatchFilter,
  },
  {
    dataField: 'configured_prefix',
    headerTitle: false,
    headerFormatter: (column, colIndex) => (
      <>
        <div data-tip data-for={'mprefix_title'}>
          {column.text}
        </div>
        <ReactTooltip html={true} id={'mprefix_title'}>
          {'The configured IPv4/IPv6 prefix that matched the hijacked prefix.'}
        </ReactTooltip>
      </>
    ),
    text: 'Matched Prefix',
    filter: exactMatchFilter,
  },
  {
    dataField: 'type',
    headerTitle: false,
    headerFormatter: (column, colIndex) => (
      <>
        <div data-tip data-for={'type_title'}>
          {column.text}
        </div>
        <ReactTooltip html={true} id={'type_title'}>
          {
            'The type of the hijack in 4 dimensions: prefix|path|data plane|policy<ul><li>[Prefix] S → Sub-prefix hijack</li>'
          }
        </ReactTooltip>
      </>
    ),
    text: 'Type',
    filter: textFilter(),
  },
  {
    dataField: 'hijack_as',
    headerTitle: false,
    headerFormatter: (column, colIndex) => (
      <>
        <div data-tip data-for={'as_title'}>
          {column.text}
        </div>
        <ReactTooltip html={true} id={'as_title'}>
          {
            'The AS that is potentially responsible for the hijack.</br>Note that this is an experimental field.'
          }
        </ReactTooltip>
      </>
    ),
    text: 'Hijacked AS',
    filter: exactMatchFilter,
  },
  {
    dataField: 'rpki_status',
    headerTitle: false,
    headerFormatter: (column, colIndex) => (
      <>
        <div data-tip data-for={'rpki_title'}>
          {column.text}
        </div>
        <ReactTooltip html={true} id={'rpki_title'}>
          {'The RPKI status of the hijacked prefix.'}
        </ReactTooltip>
      </>
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
    headerFormatter: (column, colIndex, components) => (
      <>
        <div data-tip data-for={'peers_title'}>
          {
            <span>
              {column.text} {components.sortElement}
            </span>
          }
        </div>
        <ReactTooltip html={true} id={'peers_title'}>
          {
            'Number of peers/monitors (i.e., ASNs)</br>that have seen hijack updates.'
          }
        </ReactTooltip>
      </>
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
    headerFormatter: (column, colIndex, components) => (
      <>
        <div data-tip data-for={'ASes_title'}>
          {
            <span>
              {column.text} {components.sortElement}
            </span>
          }
        </div>
        <ReactTooltip html={true} id={'ASes_title'}>
          {
            'Number of infected ASes that seem to</br>route traffic towards the hijacker AS.</br>Note that this is an experimental field '
          }
        </ReactTooltip>
      </>
    ),
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
  {
    dataField: 'ack',
    headerTitle: false,
    headerFormatter: (column, colIndex) => (
      <>
        <div data-tip data-for={'ack_title'}>
          {column.text}
        </div>
        <ReactTooltip html={true} id={'ack_title'}>
          {
            'Whether the user has acknowledged/confirmed the hijack as a true positive.<br>If the resolve|mitigate buttons are pressed this<br>is automatically set to True (default value: False).'
          }
        </ReactTooltip>
      </>
    ),
    text: 'Ack',
  },
];

function handleData(data, tooltips, setTooltips, context, offset) {
  const HIJACK_DATA = data;
  let hijacks;

  if (HIJACK_DATA && HIJACK_DATA.length) {
    hijacks = HIJACK_DATA.map((row, i) => {
      return {
        id: i,
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
            label={`hijack_as_` + i + '_' + offset}
            context={context}
          />
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

const OngoingHijackTableComponent = (props) => {
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
        {options.map((option, i) => (
          <option
            key={i}
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

  const pageButtonRenderer = ({ page, active, onPageChange }) => {
    const handleClick = (e) => {
      e.preventDefault();
      onPageChange(page);
    };

    return (
      <li className={(active ? 'active' : '') + ' page-item'}>
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
    lastPageTitle: 'Last page',
    showTotal: true,
    custom: true,
    dataSize: hijackCount,
    page: page,
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
      exportCSV={{ onlyExportFiltered: true, exportAll: false }}
    >
      {(toolkitprops) => {
        paginationProps.dataSize = hijackCount;
        return (
          <>
            <div className="header-filter">
              <SizePerPageDropdownStandalone {...paginationProps} />
            </div>
            <BootstrapTable
              remote
              wrapperClasses="table-responsive"
              keyField="id"
              data={hijackData}
              columns={columns}
              expandRow={expandRow}
              filter={filterFactory()}
              onTableChange={handleTableChange}
              filterPosition="bottom"
              striped
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

export default OngoingHijackTableComponent;
