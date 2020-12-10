import { Button } from '@material-ui/core';
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
            <b>
              <div data-tip data-for={'hprefix_exp'}>
                {<span>{'Hijacked Prefix'}</span>}
              </div>
              <ReactTooltip html={true} id={'hprefix_exp'}>
                {'The IPv4/IPv6 prefix that was hijacked.'}
              </ReactTooltip>
            </b>
          </td>
          <td>{row.hprefix.toString()}</td>
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
          <td>{row.mprefix.toString()}</td>
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
          <td>{row.rpki.toString()}</td>
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
          <td>{row.peers.toString()}</td>
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
          <td>{row.ASes.toString()}</td>
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
      </table>
    );
  },
};

const columns = [
  {
    dataField: 'update',
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
    dataField: 'mprefix',
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
    dataField: 'as',
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
    dataField: 'rpki',
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
    dataField: 'peers',
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

const OngoingHijackTableComponent = (props) => {
  const HIJACK_DATA = props.data;
  let hijacks;
  const [ASNTitle, setASNTitle] = React.useState([]);

  if (HIJACK_DATA && HIJACK_DATA.length) {
    hijacks = HIJACK_DATA.map((row, i) => {
      return {
        id: row.id,
        update: formatDate(new Date(row.time_last)),
        time: formatDate(new Date(row.time_detected)),
        hprefix: row.prefix,
        mprefix: row.configured_prefix,
        type: row.type,
        as_original: row.hijack_as,
        as: (
          <>
            <div data-tip data-for={'hijack_as' + i}>
              {row.hijack_as}
            </div>
            <ReactTooltip html={true} id={'hijack_as' + i}>
              {ASNTitle[i] ?? 'Loading...'}
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
              expandRow={expandRow}
              filter={filterFactory()}
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
    <PaginationProvider pagination={paginationFactory(options)}>
      {contentTable}
    </PaginationProvider>
  );
};

export default OngoingHijackTableComponent;
