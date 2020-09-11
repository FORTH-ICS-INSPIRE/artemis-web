import React from 'react';
// import Griddle from 'griddle-react';
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';

const products = [{update: 20, time: "sfsf", "hprefix": 3, mprefix: 3, type: "fsdf", as: "dsfsd", rpki: "dfssd", peers: 3, ASes: 2, ack: 0, more: "aa"}, {update: 23, time: "sfsf", "hprefix": 3, mprefix: 3, type: "fsdf", as: "dsfsd", rpki: "dfssd", peers: 3, ASes: 2, ack: 0, more: "aa"}];
const columns = [{
    dataField: 'update',
    text: 'Last Update',
    sort: true
}, {
    dataField: 'time',
    text: 'Time Detected',
    sort: true
}, {
    dataField: 'hprefix',
    text: 'Hijacked Prefix',
}, {
    dataField: 'mprefix',
    text: 'Matched Prefix',
}, {
    dataField: 'type',
    text: 'Type',
}, {
    dataField: 'as',
    text: 'Hijacked AS',
}, {
    dataField: 'rpki',
    text: 'RPKI',
}, {
    dataField: 'peers',
    text: '# Peers Seen',
    sort: true
}, {
    dataField: 'ASes',
    text: '# ASes Infected',
    sort: true
}, {
    dataField: 'ack',
    text: 'Ack',
}, {
    dataField: 'more',
    text: 'More',
}];

type MyProps = {
    classes: {
        paper: string,
        avatar: string,
        form: string,
        submit: string,
        input: string,
        main: string
    }
};

type MyState = {
    email: string,
    setEmail: string,
    password: string,
    setPassword: string,
    loginError: string,
    setLoginError: string
};

class HijackTable extends React.Component<MyProps, MyState> {
    render() {
        return (
            <BootstrapTable keyField='update' data={products} columns={columns} />
        );
    }
}

export default HijackTable;
