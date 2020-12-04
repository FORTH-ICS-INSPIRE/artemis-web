import { Button } from '@material-ui/core';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import NotFoundHOC from '../../components/404-hoc/404-hoc';
import UserListComponent from '../../components/user-list/user-list';

const UserManagementPage = (props) => {
  const user = props.user;
  const [userList, setUserList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [normalList, setNormalList] = useState([]);
  const [adminList, setAdminList] = useState([]);

  const approvalRef = React.createRef();
  const promoteRef = React.createRef();
  const demoteRef = React.createRef();
  const deleteRef = React.createRef();

  const manageUser = async (e, action) => {
    e.preventDefault();
    let userName;

    switch (action) {
      case 'approval':
        userName = approvalRef.current.value;
        break;
      case 'promote':
        userName = promoteRef.current.value;
        break;
      case 'demote':
        userName = demoteRef.current.value;
        break;
      case 'delete':
        userName = deleteRef.current.value;
        break;
    }

    const res = await fetch('/api/usermanagement', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: action, userName: userName }),
    });

    if (res.status === 200) {
      window.location.reload();
    }
  };

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/userlist', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200) {
        const list = (await res.json()).filter(
          (cUser) => cUser.email !== user.email
        );
        setUserList(list);
        setPendingList(list.filter((user) => user.role === 'pending'));
        setNormalList(list.filter((user) => user.role === 'user'));
        setAdminList(list.filter((user) => user.role === 'admin'));
      } else {
        // setErrorMsg(await res.text());
      }
    })();
  }, []);

  return (
    <>
      <Head>
        <title>ARTEMIS - User Management</title>
      </Head>
      <div id="page-container" style={{ paddingTop: '120px' }}>
        {user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="row">
                  <div className="col-lg-8">
                    <h1 style={{ color: 'white' }}>User Management</h1>{' '}
                  </div>
                  <div className="col-lg-1"></div>
                </div>
                <hr style={{ backgroundColor: 'white' }} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-3">
                <div className="card">
                  <div className="card-header">Approve pending users</div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-12" style={{ fontWeight: 'bold' }}>
                        Select pending user to approve:
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '30px' }}>
                      <div className="col-lg-8">
                        <select
                          ref={
                            approvalRef as React.RefObject<HTMLSelectElement>
                          }
                          className="form-control"
                          id="distinct_values_selection"
                        >
                          {pendingList.map((user) => (
                            <option>{user.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '30px' }}>
                      <div className="col-lg-8">
                        <Button
                          onClick={(e) => manageUser(e, 'approval')}
                          id="approval"
                          variant="outlined"
                          color="primary"
                        >
                          Approve User
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="card">
                  <div className="card-header">Promote to Admin</div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-12" style={{ fontWeight: 'bold' }}>
                        Select user to give admin privileges:
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '30px' }}>
                      <div className="col-lg-8">
                        <select
                          ref={promoteRef as React.RefObject<HTMLSelectElement>}
                          className="form-control"
                          id="distinct_values_selection"
                        >
                          {normalList.map((user) => (
                            <option>{user.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '30px' }}>
                      <div className="col-lg-8">
                        <Button
                          onClick={(e) => manageUser(e, 'promote')}
                          id="promote"
                          variant="outlined"
                          color="primary"
                        >
                          Promote to Admin
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="card">
                  <div className="card-header">Demote Admin</div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-12" style={{ fontWeight: 'bold' }}>
                        Select user to remove admin privileges:
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '30px' }}>
                      <div className="col-lg-8">
                        <select
                          ref={demoteRef as React.RefObject<HTMLSelectElement>}
                          className="form-control"
                          id="distinct_values_selection"
                        >
                          {adminList.map((user) => (
                            <option>{user.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '30px' }}>
                      <div className="col-lg-8">
                        <Button
                          onClick={(e) => manageUser(e, 'demote')}
                          id="demote"
                          variant="outlined"
                          color="primary"
                        >
                          Demote to User
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="card">
                  <div className="card-header">Delete User</div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-12" style={{ fontWeight: 'bold' }}>
                        Select user to delete:
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '30px' }}>
                      <div className="col-lg-8">
                        <select
                          ref={deleteRef as React.RefObject<HTMLSelectElement>}
                          className="form-control"
                          id="distinct_values_selection"
                        >
                          {userList.map((user) => (
                            <option>{user.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '30px' }}>
                      <div className="col-lg-8">
                        <Button
                          onClick={(e) => manageUser(e, 'delete')}
                          id="delete"
                          variant="outlined"
                          color="primary"
                        >
                          Delete User
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="card">
                  <div className="card-header"> User list </div>
                  <div className="card-body">
                    <UserListComponent data={userList} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotFoundHOC(UserManagementPage, ['admin']);
