import { Button } from '@material-ui/core';
import UserCreationComponent from '../../components/user-creation/user-creation';
import UsersPasswordComponent from '../../components/users-password/users-password';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import AuthHOC from '../../components/401-hoc/401-hoc';
import UserListComponent from '../../components/user-list/user-list';
import { autoLogout, formatDate } from '../../utils/token';
import { setup } from '../../libs/csrf';
import { Card, CardBody } from '@windmill/react-ui';

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
  const _csrf = props._csrf;

  const manageUser = async (e, action, userName) => {
    e.preventDefault();

    const res = await fetch('/api/usermanagement', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        userName: userName,
        _csrf: _csrf,
      }),
    });

    if (res.status === 200) {
      window.location.reload();
    } else {
      setErrorMsg((await res.json()).message);
    }
  };

  useEffect(() => {
    autoLogout(props);
    (async () => {
      const res = await fetch('/api/userlist', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200) {
        let list = (await res.json()).filter(
          (cUser) => cUser.email !== user.email
        );
        list = list.map((user) => {
          user.lastLogin = formatDate(new Date(user.lastLogin), Math.abs(new Date().getTimezoneOffset() / 60));
          return user;
        });
        setUserList(list);
        setPendingList(list.filter((user) => user.role === 'pending'));
        setNormalList(list.filter((user) => user.role === 'user'));
        setAdminList(list.filter((user) => user.role === 'admin'));
      } else {
        setErrorMsg((await res.json()).message);
      }
    })();
  }, [user.email, props]);

  return (
    <>
      <Head>
        <title>ARTEMIS - User Management</title>
      </Head>

      <div className="relative w-full h-full">
        {/* Page title ends */}
        <div className="w-3/4 mx-auto px-6">
          <h1 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">User Management</h1>
          <div className="space-x-12">
            <Card className="mb-8 shadow-md w-1/5 inline-block">
              <CardBody>
                Select pending user to approve:
                <select
                  ref={
                    approvalRef as React.RefObject<HTMLSelectElement>
                  }
                  className="form-control mt-2"
                  id="distinct_values_selection"
                >
                  {pendingList.map((user, i) => (
                    <option key={`1${i}`}>{user.name}</option>
                  ))}
                </select>

                <Button
                  onClick={(e) =>
                    manageUser(e, 'approval', approvalRef.current.value)
                  }
                  id="approval"
                  variant="contained"
                  className="material-button" // color="primary"
                >
                  Approve User
                </Button>
              </CardBody>
            </Card>

            <Card className="mb-8 shadow-md w-1/5 inline-block">
              <CardBody>
                Select user to give admin privileges:
                <select
                  ref={promoteRef as React.RefObject<HTMLSelectElement>}
                  className="form-control mt-2"
                  id="distinct_values_selection"
                >
                  {normalList.map((user, i) => (
                    <option key={`2${i}`}>{user.name}</option>
                  ))}
                </select>

                <Button
                  onClick={(e) =>
                    manageUser(e, 'promote', promoteRef.current.value)
                  }
                  id="promote"
                  variant="contained"
                  className="material-button"
                >
                  Promote to Admin
                </Button>
              </CardBody>
            </Card>

            <Card className="mb-8 shadow-md w-1/5 inline-block">
              <CardBody>
                Select user to remove admin privileges:
                <select
                  ref={demoteRef as React.RefObject<HTMLSelectElement>}
                  className="form-control mt-2"
                  id="distinct_values_selection"
                >
                  {adminList.map((user, i) => (
                    <option key={`3${i}`}>{user.name}</option>
                  ))}
                </select>

                <Button
                  onClick={(e) =>
                    manageUser(e, 'demote', demoteRef.current.value)
                  }
                  id="demote"
                  variant="contained"
                  className="material-button"
                >
                  Demote to User
                </Button>
              </CardBody>
            </Card>

            <Card className="mb-8 shadow-md w-1/5 inline-block">
              <CardBody>
                Select user to delete:
                <select
                  ref={deleteRef as React.RefObject<HTMLSelectElement>}
                  className="form-control mt-2"
                  id="distinct_values_selection"
                >
                  {userList.map((user, i) => (
                    <option key={`4${i}`}>{user.name}</option>
                  ))}
                </select>

                <Button
                  onClick={(e) =>
                    manageUser(e, 'delete', deleteRef.current.value)
                  }
                  id="delete"
                  variant="contained"
                  className="material-button"
                >
                  Delete User
                </Button>
              </CardBody>
            </Card>
          </div>
          <div className="space-x-24">
            <Card className="mb-8 shadow-md w-2/5 inline-block pt-20">
              <CardBody>
                <UsersPasswordComponent
                  data={userList}
                  {...props}
                ></UsersPasswordComponent>
              </CardBody>
            </Card>
            <Card className="mb-8 shadow-md w-2/5 inline-block pt-2">
              <CardBody>
                <UserCreationComponent
                  data={userList}
                  {...props}
                ></UserCreationComponent>
              </CardBody>
            </Card>
          </div>
          <Card className="mb-8 shadow-md w-full inline-block">
            <CardBody>
              <UserListComponent {...props} data={userList} />
            </CardBody>
          </Card>
        </div>
      </div>
      {/* <div id="page-container">
        {user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            {errorMsg && <p className="error">{errorMsg}</p>}
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="row">
                  <div className="col-lg-8">
                    <h1 style={{ color: 'black' }}>User Management</h1>{' '}
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
                          {pendingList.map((user, i) => (
                            <option key={`1${i}`}>{user.name}</option>
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
                          variant="contained"
                          className="material-button" // color="primary"
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
                          {normalList.map((user, i) => (
                            <option key={`2${i}`}>{user.name}</option>
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
                          variant="contained"
                          className="material-button"
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
                          {adminList.map((user, i) => (
                            <option key={`3${i}`}>{user.name}</option>
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
                          variant="contained"
                          className="material-button"
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
                          {userList.map((user, i) => (
                            <option key={`4${i}`}>{user.name}</option>
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
                          variant="contained"
                          className="material-button"
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
                    <UserListComponent {...props} data={userList} />
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
                      {...props}
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
                      {...props}
                    ></UserCreationComponent>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div> */}
    </>
  );
};

export default AuthHOC(UserManagementPage, ['admin']);

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return { props: { _csrf: csrftoken, _inactivity_timeout: process.env.INACTIVITY_TIMEOUT, system_version: process.env.SYSTEM_VERSION } };
});
