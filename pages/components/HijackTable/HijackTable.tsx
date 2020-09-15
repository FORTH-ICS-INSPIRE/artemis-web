import React from "react";
// import Griddle from 'griddle-react';
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from "react-bootstrap-table-next";
import Container from "@material-ui/core/Container";

const products = [
  {
    update: "2020-08-24 19:53:44",
    time: "2020-08-24 09:01:50",
    status: "Withdrawn",
    hprefix: "139.91.250.0/24",
    mprefix: "139.91.250.0/24",
    type: "E|0|-|-",
    as: "264409",
    rpki: "IA",
    peers: 1,
    ASes: 0,
    ack: 0,
    more: "aa",
  },
];

const columns = [
  {
    dataField: "update",
    text: "Last Update",
    sort: true,
    headerTitle: () =>
      "The timestamp of the newest known (to the system) BGP update that is related to the hijack.",
    sortCaret: (order, column) => {
      if (!order)
        return (
          <span>
            &nbsp;&nbsp;&darr;<span style={{ color: "red" }}>/&uarr;</span>
          </span>
        );
      else if (order === "asc")
        return (
          <span>
            &nbsp;&nbsp;&darr;<span style={{ color: "red" }}>/&uarr;</span>
          </span>
        );
      else if (order === "desc")
        return (
          <span>
            &nbsp;&nbsp;<span style={{ color: "red" }}>&darr;</span>/&uarr;
          </span>
        );
      return null;
    },
  },
  {
    dataField: "time",
    text: "Time Detected",
    sort: true,
    headerTitle: () =>
      "The time when a hijack event was first detected by the system.",
    sortCaret: (order, column) => {
      if (!order)
        return (
          <span>
            &nbsp;&nbsp;&darr;<span style={{ color: "red" }}>/&uarr;</span>
          </span>
        );
      else if (order === "asc")
        return (
          <span>
            &nbsp;&nbsp;&darr;<span style={{ color: "red" }}>/&uarr;</span>
          </span>
        );
      else if (order === "desc")
        return (
          <span>
            &nbsp;&nbsp;<span style={{ color: "red" }}>&darr;</span>/&uarr;
          </span>
        );
      return null;
    },
  },
  {
    dataField: "status",
    headerTitle: () =>
      "The status of a hijack event (possible values: ongoing|dormant|withdrawn|under mitigation|ignored|resolved|outdated).",
    text: "Status",
  },
  {
    dataField: "hprefix",
    headerTitle: () => "The IPv4/IPv6 prefix that was hijacked.",
    text: "Hijacked Prefix",
  },
  {
    dataField: "mprefix",
    headerTitle: () =>
      "The configured IPv4/IPv6 prefix that matched the hijacked prefix.",
    text: "Matched Prefix",
  },
  {
    dataField: "type",
    headerTitle: () =>
      "The type of the hijack in 4 dimensions: prefix|path|data plane|policy<ul><li>[Prefix] S → Sub-prefix hijack</li>",
    text: "Type",
  },
  {
    dataField: "as",
    headerTitle: () =>
      "The AS that is potentially responsible for the hijack.</br>Note that this is an experimental field.",
    text: "Hijacked AS",
  },
  {
    dataField: "rpki",
    headerTitle: () => "The RPKI status of the hijacked prefix.",
    text: "RPKI",
  },
  {
    dataField: "peers",
    headerTitle: () =>
      "Number of peers/monitors (i.e., ASNs)</br>that have seen hijack updates.",
    text: "# Peers Seen",
    sort: true,
    sortCaret: (order, column) => {
      if (!order)
        return (
          <span>
            &nbsp;&nbsp;&darr;<span style={{ color: "red" }}>/&uarr;</span>
          </span>
        );
      else if (order === "asc")
        return (
          <span>
            &nbsp;&nbsp;&darr;<span style={{ color: "red" }}>/&uarr;</span>
          </span>
        );
      else if (order === "desc")
        return (
          <span>
            &nbsp;&nbsp;<span style={{ color: "red" }}>&darr;</span>/&uarr;
          </span>
        );
      return null;
    },
  },
  {
    dataField: "ASes",
    text: "# ASes Infected",
    headerTitle: () =>
      "Number of infected ASes that seem to</br>route traffic towards the hijacker AS.</br>Note that this is an experimental field",
    sort: true,
    sortCaret: (order, column) => {
      if (!order)
        return (
          <span>
            &nbsp;&nbsp;&darr;<span style={{ color: "red" }}>/&uarr;</span>
          </span>
        );
      else if (order === "asc")
        return (
          <span>
            &nbsp;&nbsp;&darr;<span style={{ color: "red" }}>/&uarr;</span>
          </span>
        );
      else if (order === "desc")
        return (
          <span>
            &nbsp;&nbsp;<span style={{ color: "red" }}>&darr;</span>/&uarr;
          </span>
        );
      return null;
    },
  },
  {
    dataField: "ack",
    headerTitle: () =>
      "Whether the user has acknowledged/confirmed the hijack as a true positive.<br>If the resolve|mitigate buttons are pressed this<br>is automatically set to True (default value: False).",
    text: "Ack",
  },
  {
    dataField: "more",
    headerTitle: () => "Further information related to the hijack.",
    text: "More",
  },
];

class HijackTable extends React.Component {
  render() {
    return (
      <BootstrapTable keyField="update" data={products} columns={columns} />
    );
  }
}

export default HijackTable;
