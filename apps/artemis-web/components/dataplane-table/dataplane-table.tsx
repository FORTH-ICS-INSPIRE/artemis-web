import { Button } from '@material-ui/core';
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
import { formatDate, genTooltip } from '../../utils/token';
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

const columns = [
    {
        dataField: 'msm_type',
        text: 'Measurement Type',
        sort: true,
        headerTitle: false,
        headerFormatter: (column, colIndex, components) =>
            genTooltip(
                column,
                components,
                'msm_type_title',
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
        dataField: 'msm_protocol',
        text: 'Protocol',
        sort: true,
        headerTitle: false,
        headerFormatter: (column, colIndex, components) =>
            genTooltip(
                column,
                components,
                'msm_protocol_title',
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
        dataField: 'msm_start_time',
        headerTitle: false,
        headerFormatter: (column, colIndex, components) =>
            genTooltip(
                column,
                components,
                'msm_start_title',
                'The status of a hijack event (possible values: ongoing|dormant|withdrawn|under mitigation|ignored|resolved|outdated).'
            ),
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
                'The IPv4/IPv6 prefix that was hijacked'
            ),
        text: 'Target IP',
    },
    {
        dataField: 'num_of_probes',
        headerTitle: false,
        headerFormatter: (column, colIndex, components) =>
            genTooltip(
                column,
                components,
                'num_of_probes_title',
                'The configured IPv4/IPv6 prefix that matched the hijacked prefix.'
            ),
        text: '# Probes',
    },
    {
        dataField: 'hijacker_as',
        headerTitle: false,
        headerFormatter: (column, colIndex, components) =>
            genTooltip(
                column,
                components,
                'hijacker_as_title',
                'The type of the hijack in 4 dimensions: prefix|path|data plane|policy<ul><li>[Prefix] S → Sub-prefix hijack</li>'
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
                'The AS that is potentially responsible for the hijack.</br>Note that this is an experimental field.'
            ),
        text: 'Hijacker Confirmed',
    },
    {
        dataField: 'msm_id',
        headerTitle: false,
        headerFormatter: (column, colIndex, components) =>
            genTooltip(
                column,
                components,
                'msm_id_title',
                'The RPKI status of the hijacked prefix.'
            ),
        text: 'Measurement ID',
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

const DataplaneTableComponent = (props) => {
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
                <Tooltip
                    tooltips={tooltips}
                    setTooltips={setTooltips}
                    asn={row.hijack_as}
                    label={`hijack_as`}
                    context={context}
                />
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

export default DataplaneTableComponent;
