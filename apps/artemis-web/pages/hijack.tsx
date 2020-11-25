import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  makeStyles,
  Paper,
  Switch,
} from '@material-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFoundHOC from '../components/404-hoc/404-hoc';
import BGPTableComponent from '../components/bgp-table/bgp-table';
import HijackTableComponent from '../components/hijack-table/hijack-table';
import { useGraphQl } from '../hooks/useGraphQL';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const ViewHijackPage = (props) => {
  const [isLive, setIsLive] = useState(true);

  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { worker } = require('../mocks/browser');
      worker.start();
    }
  }

  const classes = useStyles();
  const router = useRouter();
  const key: any = router.query.key;
  const user = props.user;

  const HIJACK_DATA = useGraphQl(
    'hijackByKey',
    props.isProduction,
    isLive,
    key
  );

  const BGP_DATA = useGraphQl('bgpByKey', props.isProduction, isLive, key);
  const hijack = HIJACK_DATA ? HIJACK_DATA.view_hijacks[0] : [];
  const bgp = BGP_DATA ? BGP_DATA.view_data : [];

  const hijackInfo = {
    'Hijacker AS': hijack.hijack_as,
    Type: hijack.type,
    '# Peers Seen': hijack.num_peers_seen,
    '# ASes Infected': hijack.num_asns_inf,
    Prefix: hijack.prefix,
    Matched: hijack.configured_prefix,
    Config: hijack.timestamp_of_config,
    Key: hijack.key,
  };

  const hijackInfo2 = {
    'Time Started': hijack.time_started,
    'Time Detected': hijack.time_detected,
    'Last Update': hijack.time_last,
    'Time Ended': hijack.time_ended,
    'Mitigation Started': hijack.mitigation_started ?? 'Never',
    'Community Annotation': hijack.community_annotation,
    'RPKI Status': hijack.rpki_status,
    'Display Peers Seen Hijack': hijack.peers_seen,
  };

  return (
    <>
      <Head>
        <title>ARTEMIS - Hijack</title>
      </Head>
      {user && (
        <div
          className="container overview col-lg-12"
          style={{ paddingTop: '120px' }}
        >
          <div className="row">
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="row">
                <div className="col-lg-8" style={{ color: 'white' }}>
                  <h1>Viewing Hijack</h1>
                </div>
                <div className="col-lg-1"></div>
                <div className="col-lg-2">
                  <h2 style={{ color: 'white' }}>Live Updates </h2>{' '}
                </div>
                <hr style={{ backgroundColor: 'white' }} />
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-lg-1" />
            <div className="col-lg-7">
              <div className="card">
                <div className="card-header">Hijack Information</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6">
                      {Object.keys(hijackInfo).map((key) => {
                        return (
                          <div className="row">
                            <div
                              className="col-lg-4"
                              style={{ fontWeight: 'bold' }}
                            >
                              {key}:
                            </div>
                            <div className="col-lg-8">
                              <input
                                id="info_type"
                                className="form-control"
                                type="text"
                                readOnly={true}
                                value={hijackInfo[key]}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="col-lg-6">
                      {Object.keys(hijackInfo2).map((key) => {
                        return (
                          <div className="row">
                            <div
                              className="col-lg-4"
                              style={{ fontWeight: 'bold' }}
                            >
                              {key}:
                            </div>
                            <div className="col-lg-8">
                              <input
                                id="info_type"
                                className="form-control"
                                type="text"
                                readOnly={true}
                                value={hijackInfo2[key]}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card">
                <div className="card-header">Comments</div>
                <div className="card-body"></div>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="card">
                <div className="card-header">Related BGP Updates</div>
                <div className="card-body">
                  <BGPTableComponent data={bgp} />
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="card">
                <div className="card-header"> View distinct values </div>
                <div className="card-body">
                  <div className="col-lg-3">
                    <select
                      className="form-control"
                      id="distinct_values_selection"
                      // value={selectState}
                      // onChange={onChangeValue.bind(this)}
                    >
                      <option value="select">Select</option>
                      <option value="prefix">Prefix</option>
                      <option value="matched_prefix">Matched Prefix</option>
                      <option value="origin_as">Origin AS</option>
                      <option value="peer_asn">Peer AS</option>
                      <option value="service">Service</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <Grid container spacing={3}>
                    {/* {distinctValues.map((value, i) => {
                      if (value !== undefined)
                        return (
                          <Grid key={i} item xs>
                            <Paper className={classes.paper}>{value}</Paper>
                          </Grid>
                        );
                    })} */}
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotFoundHOC(ViewHijackPage, ['admin', 'user']);
