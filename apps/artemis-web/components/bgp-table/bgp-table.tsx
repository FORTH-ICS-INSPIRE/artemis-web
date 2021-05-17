// import { useSubscription } from '@apollo/client/react/hooks/useSubscription';
import Link from 'next/link';
import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
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
  expandColumnComponent,
  formatDate,
  fromEntries,
  genTooltip,
  getISODate,
  getSortCaret,
  isObjectEmpty,
  shallSubscribe,
  expandedColumnHeaderComponent,
  getExactMatchFilter,
  getTextFilter,
  compareObjects,
  isNumeric,
} from '../../utils/token';
import ErrorBoundary from '../error-boundary/error-boundary';
import Tooltip from '../tooltip/tooltip';
import ExportJSON from '../export-json/export-json';

const getExpandRow = (expandState, tooltips, setTooltips, context) => {
  return {
    showExpandColumn: true,
    expandByColumnOnly: true,
    expandColumnPosition: 'right',
    expanded: expandState,
    expandColumnRenderer: expandColumnComponent,
    expandHeaderColumnRenderer: expandedColumnHeaderComponent,
    renderer: (row, i) => {
      return (
        <table>
          <thead></thead>
          <tbody>
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
              <td style={{ textAlign: 'center' }}>
                {row.as_path.map((asn, j) => {
                  return (
                    <div
                      key={j}
                      style={{ display: 'inline-block', marginLeft: '4px' }}
                    >
                      <Tooltip
                        tooltips={tooltips}
                        setTooltips={setTooltips}
                        asn={asn}
                        label={`asn ${i} ${j}`}
                        context={context}
                      />
                    </div>
                  );
                })}
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
          </tbody>
        </table>
      );
    },
  };
};

const getColumns = (stateValues) => [
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
      return getSortCaret(order);
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
    filter: getExactMatchFilter(stateValues['prefix'], 'Prefix'),
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
    filter: getExactMatchFilter(
      stateValues['matched_prefix'],
      'Matched Prefix'
    ),
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
    filter: getExactMatchFilter(stateValues['origin_as_original'], 'Origin AS'),
  },
  {
    dataField: 'as_path2',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'path_title',
        'The AS-level path of the update.'
      ),
    text: 'AS Path',
    filter: getTextFilter(stateValues['as_path2'], 'AS Path'),
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
    text: 'Peer AS',
    filter: getExactMatchFilter(stateValues['peer_asn_original'], 'Peer AS'),
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
    filter: getTextFilter(stateValues['service'], 'Service'),
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
      placeholder: 'Type',
      defaultValue: stateValues['type'],
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

function handleData(
  bgpData,
  tooltips,
  setTooltips,
  context,
  setFilteredBgpData,
  filter = 0
) {
  let bgp;

  if (bgpData && bgpData.length) {
    bgp = bgpData.map((row, i) => {
      const origin_as =
        row['origin_as'] === -1 ? (
          <span>-</span>
        ) : (
          <Tooltip
            tooltips={tooltips}
            setTooltips={setTooltips}
            asn={row['origin_as']}
            label={`origin${i}`}
            context={context}
          />
        );
      const peer_as =
        row['peer_asn'] === -1 ? (
          <span>-</span>
        ) : (
          <Tooltip
            tooltips={tooltips}
            setTooltips={setTooltips}
            asn={row['peer_asn']}
            label={`peer${i}`}
            context={context}
          />
        );
      const as_path = row.as_path.map((asn, j) => {
        return (
          <div key={j} style={{ float: 'left', marginLeft: '4px' }}>
            <Tooltip
              tooltips={tooltips}
              setTooltips={setTooltips}
              asn={asn}
              label={`asn ${i} ${j}`}
              context={context}
            />
          </div>
        );
      });
      return {
        ...row,
        origin_as_original: origin_as,
        peer_asn_original: peer_as,
        as_path2: as_path,
      };
    });
  } else {
    bgp = [];
  }

  bgp = bgp.map((row, i) =>
    fromEntries(
      Object.entries(row).map(([key, value]: [string, any]) => {
        if (key === 'timestamp') return [key, formatDate(new Date(value), 3)];
        else if (key === 'service') return [key, value.replace(/\|/g, ' -> ')];
        else if (key === 'as_path') return [key, value];
        else if (key === 'handled')
          return [
            key,
            value ? (
              <img alt="" src="handled.png" />
            ) : (
              <img alt="" src="./unhadled.png" />
            ),
          ];
        else return [key, value];
      })
    )
  );

  bgp.forEach((entry, i) => {
    entry.id = i;
  });

  setFilteredBgpData(bgp);

  return bgp;
}

const BGPTableComponent = (props) => {
  const { setFilteredBgpData, filter, hijackKey, filterTo, _csrf } = props;
  const [bgpData, setBgpData] = useState([]);
  const context = React.useContext(TooltipContext);
  const [tooltips, setTooltips] = useState({});
  const [page, setPage] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [columnFilter, setColumnFilter] = useState({});
  const dateFrom: string = getISODate(filter);
  const dateTo: string = getISODate(filterTo ?? 0);

  const exportFilters = {
    hasColumnFilter: !isObjectEmpty(columnFilter),
    columnFilter: columnFilter,
    hasDateFilter: filter !== 0,
    dateRange: { dateTo: dateTo, dateFrom: dateFrom },
    key: hijackKey,
  };

  let bgpCount = 0;

  const BGP_COUNT: any = useGraphQl(hijackKey ? 'bgpCountByKey' : 'bgpCount', {
    isLive: props.isLive,
    callback: (data) => {
      return;
    },
    hasColumnFilter: !isObjectEmpty(columnFilter),
    columnFilter: columnFilter,
    hasDateFilter: filter !== 0,
    dateRange: { dateTo: dateTo, dateFrom: dateFrom },
    key: hijackKey,
  });

  bgpCount =
    BGP_COUNT && BGP_COUNT.data ? BGP_COUNT.data.count_data.aggregate.count : 0;

  const [limitState, setLimitState] = useState(10);
  const [offsetState, setOffsetState] = useState(0);
  const [sortState, setSortState] = useState('desc');
  const expandState = [];
  const filterState = filter;
  const filteredDate: Date = new Date();
  const [stateValues, setStateValues] = useState({
    prefix: '',
    matched_prefix: '',
    peer_asn_original: '',
    origin_as_original: '',
    service: '',
    as_path2: '',
    type: '',
  });

  filteredDate.setHours(filteredDate.getHours() - filter);

  useGraphQl(hijackKey ? 'bgpByKey' : 'bgpUpdates', {
    callback: (data) => {
      const processedData = handleData(
        shallSubscribe(props.isLive)
          ? data.subscriptionData.data.view_bgpupdates.slice(0, limitState)
          : data.view_bgpupdates.slice(0, limitState),
        tooltips,
        setTooltips,
        context,
        setFilteredBgpData,
        filterState
      );

      setBgpData(processedData);
    },
    isLive: shallSubscribe(props.isLive),
    limits: {
      limit: limitState,
      offset: offsetState,
    },
    sortOrder: sortState,
    sortColumn: 'time_last',
    hasDateFilter: filter !== 0,
    key: hijackKey,
    hasColumnFilter: !isObjectEmpty(columnFilter),
    columnFilter: columnFilter,
    dateRange: { dateTo: dateTo, dateFrom: dateFrom },
  });

  // setExpandState([]);

  const skippedCols = props.skippedCols ?? [];

  const filteredCols = getColumns(stateValues).filter(
    (col) => !skippedCols.includes(col.dataField)
  );

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
      Shows
      <select
        style={{ width: '80px', marginLeft: '10px', marginRight: '10px' }}
        onChange={(event) =>
          onSizePerPageChange(parseInt(event.target.value, 10))
        }
        className="custom-select custom-select-sm form-control form-control-sm"
      >
        {options.map((option) => (
          <option
            key={option.text}
            value={option.text}
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
    lastPageTitle: 'Last page',
    sortOrder: 'desc',
    sortName: 'timestamp',
    showTotal: true,
    custom: true,
    hidePageListOnlyOnePage: true,
    paginationTotalRenderer: customTotal,
    dataSize: bgpCount,
    disablePageTitle: true,
    page: page,
    sizePerPage: sizePerPage,
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
    { page, sizePerPage, sortOrder, filters }
  ) => {
    const currentIndex = page * sizePerPage;
    setPage(page);
    setSizePerPage(sizePerPage);

    setOffsetState(currentIndex);

    setLimitState(sizePerPage);

    if (sortOrder) setSortState(sortOrder);
    if (filters) {
      const keys = Object.keys(filters);
      keys.forEach((key) => {
        if (filters[key])
          setStateValues({
            ...stateValues,
            [key]:
              isNumeric(filters[key].filterVal) || key === 'service'
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
      columns={filteredCols}
      data={bgpData}
      dataSize={bgpCount}
      exportCSV={{ onlyExportFiltered: true, exportAll: false }}
    >
      {(toolkitprops) => {
        paginationProps.dataSize = bgpCount;
        paginationTableProps.dataSize = bgpCount;

        return (
          <>
            <div style={{ marginBottom: '10px' }} className="header-filter">
              <div className="row">
                <div className="col-lg-12">
                  <ExportJSON
                    action="view_bgpupdates"
                    _csrf={_csrf}
                    dateField={'timestamp'}
                    exportFilters={exportFilters}
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
              data={bgpData}
              columns={filteredCols}
              expandRow={getExpandRow(
                expandState,
                tooltips,
                setTooltips,
                context
              )}
              filter={filterFactory()}
              striped
              hover
              condensed
              filterPosition="top"
              onTableChange={handleTableChange}
              noDataIndication={() => <h3>No bgp updates.</h3>}
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
      noDataMessage={'No bgp updates.'}
      customError={''}
    >
      <PaginationProvider pagination={paginationFactory(options)}>
        {contentTable}
      </PaginationProvider>
    </ErrorBoundary>
  );
};

export default BGPTableComponent;
