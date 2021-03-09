// import { useSubscription } from '@apollo/client/react/hooks/useSubscription';
import { Button } from '@material-ui/core';
import { useStyles } from '../../utils/styles';
import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
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
  fromEntries,
  genTooltip,
  getSortCaret,
} from '../../utils/token';
import ErrorBoundary from '../error-boundary/error-boundary';
import Tooltip from '../tooltip/tooltip';

const getColumns = () => [
  {
    dataField: 'msm_type',
    text: 'Measurement Type',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(column, components, 'msm_type_title', 'Ping | Traceroute.'),
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
  {
    dataField: 'msm_protocol',
    text: 'Protocol',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(column, components, 'msm_protocol_title', 'ICMP | TCP | UDP'),
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
  {
    dataField: 'msm_start_time',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'msm_start_title',
        'The date and time that the measurement starts.'
      ),
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
    text: 'Start Time',
  },
  {
    dataField: 'target_ip',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'target_ip_title',
        'The target measurement IP of the Victim AS.'
      ),
    text: 'Target IP',
  },
  {
    dataField: 'msm_stop_time',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'msm_stop_title',
        'The date and time that the measurement stops.'
      ),
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
    text: 'Stop Time',
  },
  {
    dataField: 'num_of_probes',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'num_of_probes_title',
        'The number of RIPE Atlas probes that participated in the measurement.'
      ),
    text: '# Probes',
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
  {
    dataField: 'hijack_as_original',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'hijacker_as_title',
        'The AS that is potentially responsible for the hijack.'
      ),
    text: 'Hijacker AS',
  },
  {
    dataField: 'hijacked',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'hijacked_title',
        'Yes -> Origin AS is hijacked.</br>No -> Origin AS is not hijacked.</br>NA -> Not Answer.'
      ),
    text: 'Hijacker Confirmed',
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
  {
    dataField: 'msm_id',
    headerTitle: false,
    headerFormatter: (column, colIndex, components) =>
      genTooltip(
        column,
        components,
        'msm_id_title',
        'The RIPE Atlas measurement id.</br>Click for redirection to RIPE Atlas measurement web page.'
      ),
    text: 'Measurement ID',
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
];

function handleData(dataplaneData, tooltips, setTooltips, context) {
  let dataplane;

  if (dataplaneData && dataplaneData.length) {
    dataplane = dataplaneData.map((row, i) => {
      const hijacker_as = (
        <Tooltip
          tooltips={tooltips}
          setTooltips={setTooltips}
          asn={row['hijacker_as']}
          label={`hijack_as${i}`}
          context={context}
        />
      );

      return {
        ...row,
        hijack_as_original: hijacker_as,
      };
    });
  } else {
    dataplane = [];
  }

  dataplane = dataplane.map((row, i) =>
    fromEntries(
      Object.entries(row).map(([key, value]: [string, any]) => {
        if (key === 'msm_start_time')
          return [key, formatDate(new Date(value), 2)];
        else if (key === 'msm_stop_time')
          return [key, formatDate(new Date(value), 2)];
        else return [key, value];
      })
    )
  );

  dataplane.forEach((entry, i) => {
    entry.id = i;
  });

  return dataplane;
}

const DataplaneTableComponent = (props) => {
  const { hijackKey } = props;
  const [dataplaneData, setDataplaneData] = useState([]);
  const [dataplaneCount, setDataplaneCount] = useState(0);
  const context = React.useContext(TooltipContext);
  const [tooltips, setTooltips] = useState({});
  const [page, setPage] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sortColumnState, setSortColumnState] = useState('msm_type');

  const [limitState, setLimitState] = useState(10);
  const [offsetState, setOffsetState] = useState(0);
  const [sortState, setSortState] = useState('desc');

  useGraphQl('dataplane', {
    callback: (data) => {
      setDataplaneCount(data.view_dataplane_msms.length);
    },
    isLive: false,
    limits: {
      limit: limitState,
      offset: offsetState,
    },
    sortOrder: sortState,
    sortColumn: sortColumnState,
    hasDateFilter: false,
    key: hijackKey,
    hasColumnFilter: false,
  });

  useGraphQl('dataplane', {
    callback: (data) => {
      const processedData = handleData(
        data.view_dataplane_msms.slice(0, limitState),
        tooltips,
        setTooltips,
        context
      );
      setDataplaneData(processedData);
    },
    isLive: false,
    limits: {
      limit: limitState,
      offset: offsetState,
    },
    sortOrder: sortState,
    sortColumn: sortColumnState,
    key: hijackKey,
    hasDateFilter: false,
    hasColumnFilter: false,
  });

  const filteredCols = getColumns();

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
    dataSize: dataplaneCount,
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
  const MyExportCSV = (props) => {
    const handleClick = async () => {
      const res = await fetch('/api/download_tables', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'view_dataplane_msms' }),
      });
      const x = window.open();
      x.document.open();
      x.document.write(
        '<html><body><pre>' +
          JSON.stringify(await res.json(), null, '\t') +
          '</pre></body></html>'
      );
      x.document.close();
    };

    const classes = useStyles();

    return (
      <div>
        <Button
          // className="btn btn-success"
          style={{ float: 'right', marginBottom: '10px' }}
          variant="contained"
          className={classes.button}
          onClick={handleClick}
        >
          Download Table
        </Button>
      </div>
    );
  };

  const handleTableChange = (
    type,
    { page, sizePerPage, sortOrder, sortField }
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
  };

  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <ToolkitProvider
      keyField="id"
      columns={filteredCols}
      data={dataplaneData}
      dataSize={dataplaneCount}
      exportCSV={{ onlyExportFiltered: true, exportAll: false }}
    >
      {(toolkitprops) => {
        paginationProps.dataSize = dataplaneCount;
        paginationTableProps.dataSize = dataplaneCount;

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
              data={dataplaneData}
              columns={filteredCols}
              // expandRow={getExpandRow(expandState)}
              filter={filterFactory()}
              striped
              hover
              condensed
              filterPosition="bottom"
              onTableChange={handleTableChange}
              noDataIndication={() => <h3>No dataplane data.</h3>}
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
      containsData={true}
      noDataMessage={'No dataplane data.'}
      customError={''}
    >
      <PaginationProvider pagination={paginationFactory(options)}>
        {contentTable}
      </PaginationProvider>
    </ErrorBoundary>
  );
};

export default DataplaneTableComponent;
