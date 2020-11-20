import { Button } from '@material-ui/core';
import Head from 'next/head';
import React from 'react';
import NotFoundHOC from '../components/404-hoc/404-hoc';
import UserListComponent from '../components/user-list/user-list';

const UserManagementPage = (props) => {
  const user = props.user;

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
                          className="form-control"
                          id="distinct_values_selection"
                          value={'select'}
                        ></select>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '30px' }}>
                      <div className="col-lg-8">
                        <Button variant="outlined" color="primary">
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
                          className="form-control"
                          id="distinct_values_selection"
                          value={'select'}
                        ></select>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '30px' }}>
                      <div className="col-lg-8">
                        <Button variant="outlined" color="primary">
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
                          className="form-control"
                          id="distinct_values_selection"
                          value={'select'}
                        ></select>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '30px' }}>
                      <div className="col-lg-8">
                        <Button variant="outlined" color="primary">
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
                          className="form-control"
                          id="distinct_values_selection"
                          value={'select'}
                        ></select>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: '30px' }}>
                      <div className="col-lg-8">
                        <Button variant="outlined" color="primary">
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
                    <UserListComponent data={[]} />
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
