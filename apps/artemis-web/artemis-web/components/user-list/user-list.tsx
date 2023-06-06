import { getSortCaret } from '../../utils/token';
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: '_id',
    text: 'ID',
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
  {
    dataField: 'name',
    text: 'Username',
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
  {
    dataField: 'email',
    text: 'Email',
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
  {
    dataField: 'role',
    text: 'Role',
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
  {
    dataField: 'lastLogin',
    text: 'Last Login',
    sort: true,
    sortCaret: (order) => {
      return getSortCaret(order);
    },
  },
];

const UserListComponent = (props) => {
  const users = props.data;

  return <BootstrapTable keyField="_id" data={users} columns={columns} />;
};

export default UserListComponent;
