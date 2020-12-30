import { Button } from '@material-ui/core';
import UserCreationComponent from '../../components/user-creation/user-creation';
import UsersPasswordComponent from '../../components/users-password/users-password';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import AuthHOC from '../../components/401-hoc/401-hoc';
import UserListComponent from '../../components/user-list/user-list';

const UserManagementPage = (props) => {
  const user = props.user;
  const [userList, setUserList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [normalList, setNormalList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const approvalRef = React.createRef<HTMLSelectElement>();
  const promoteRef = React.createRef<HTMLSelectElement>();
  const demoteRef = React.createRef<HTMLSelectElement>();
  const deleteRef = React.createRef<HTMLSelectElement>();

  const manageUser = async (e, action, userName) => {
    e.preventDefault();

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
    } else {
      setErrorMsg((await res.json()).message);
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
        setErrorMsg((await res.json()).message);
      }
    })();
  }, [user.email]);

  return (
    <>
      <Head>
        <title>ARTEMIS - User Management</title>
      </Head>
      <div id="page-container" style={{ paddingTop: '120px' }}>
        {user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            {errorMsg && <p className="error">{errorMsg}</p>}
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
                          onClick={(e) =>
                            manageUser(e, 'approval', approvalRef.current.value)
                          }
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
                          onClick={(e) =>
                            manageUser(e, 'promote', promoteRef.current.value)
                          }
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
                          onClick={(e) =>
                            manageUser(e, 'demote', demoteRef.current.value)
                          }
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
                          onClick={(e) =>
                            manageUser(e, 'delete', deleteRef.current.value)
                          }
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
            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-lg-1" />
              <div className="col-lg-5">
                <div className="card">
                  <div className="card-header"> Password Change </div>
                  <div className="card-body">
                    <UsersPasswordComponent
                      data={userList}
                    ></UsersPasswordComponent>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="card">
                  <div className="card-header"> Create User </div>
                  <div className="card-body">
                    <UserCreationComponent
                      data={userList}
                    ></UserCreationComponent>
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

export default AuthHOC(UserManagementPage, ['admin']);
