import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Switch,
} from '@material-ui/core';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from 'react-tooltip';
import NotAuthHOC from '../components/401-hoc/401-hoc';
import BGPTableComponent from '../components/bgp-table/bgp-table';
import { fetchASNData } from '../utils/fetch-data';
import { useGraphQl } from '../utils/hooks/use-graphql';
import { parseASNData } from '../utils/parsers';
import { useStyles } from '../utils/styles';
import { formatDate, fromEntries } from '../utils/token';

const BGPUpdates = (props) => {
  const [isLive, setIsLive] = useState(true);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isBrowser = typeof window !== 'undefined';

  if (isDevelopment && isBrowser) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }

  const classes = useStyles();

  const [filter, setFilter] = useState(0);
  const [filterButton, setFilterButton] = useState(0);
  const [distinctValues, setDistinctValues] = useState([]);
  const [selectState, setSelectState] = useState('');
  const [ASNTitle, setASNTitle] = useState({});

  const user = props.user;
  const BGP_DATA = useGraphQl('bgpupdates', isLive).data;

  const bgp = BGP_DATA ? BGP_DATA.view_bgpupdates : [];
  const filteredDate = new Date();
  filteredDate.setHours(filteredDate.getHours() - filter);

  let filteredBgp =
    filter !== 0
      ? bgp.filter((entry) => new Date(entry.timestamp) >= filteredDate)
      : bgp;

  filteredBgp = filteredBgp.map((row, i) =>
    fromEntries(
      Object.entries(row).map(([key, value]: [string, any]) => {
        if (key === 'timestamp') return [key, formatDate(new Date(value))];
        else if (key === 'service') return [key, value.replace(/\|/g, ' -> ')];
        else if (key === 'as_path') return [key, value.join(' ')];
        else if (key === 'handled')
          return [
            key,
            value ? <img src="handled.png" /> : <img src="./unhadled.png" />,
          ];
        else return [key, value];
      })
    )
  );

  const asns = [];
  filteredBgp.forEach((entry, i) => {
    if (!asns.includes(entry.origin_as)) asns.push(entry.origin_as);
    if (!asns.includes(entry.peer_asn)) asns.push(entry.peer_asn);

    entry.id = i;
  });
  
  useEffect(() => {
    (async function setStateFn() {
      const tooltips = {};
      for (let i = 0; i < asns.length; i++) {
        const ASN_int: number | string = asns[i];

        const [name_origin, countries_origin, abuse_origin] =
          ASN_int == '-' ? ['', '', ''] : await fetchASNData(ASN_int);

        const tooltip =
          ASN_int == '-'
            ? ''
            : parseASNData(
                ASN_int,
                name_origin,
                countries_origin,
                abuse_origin
              );

        tooltips[ASN_int] = tooltip;
      }
      setASNTitle(tooltips);
    })();
  }, [bgp.length]);

  const onChangeValue = (event) => {
    setSelectState(event.target.value);

    setDistinctValues(
      filteredBgp.map((entry) => {
        return entry[event.target.value];
      })
    );
  };

  return (
    <>
      <Head>
        <title>ARTEMIS - BGP Updates</title>
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
                  <h1>BGP Updates</h1>
                </div>
                <div className="col-lg-1"></div>
                <div className="col-lg-2">
                  <h2 style={{ color: 'white' }}>Live Updates </h2>{' '}
                </div>
                <div className="col-lg-1">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={() => {
                            setIsLive(!isLive);
                          }}
                          size="medium"
                          checked={isLive}
                        />
                      }
                      label=""
                    />
                  </FormGroup>
                </div>
              </div>

              <hr style={{ backgroundColor: 'white' }} />
            </div>
          </div>
          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="card">
                <div className="card-header">
                  <Button
                    className={0 === filterButton ? 'selectedButton' : ''}
                    style={{ marginRight: '5px' }}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setFilterButton(0);
                      setFilter(0);
                      setSelectState('select');
                      setDistinctValues([]);
                    }}
                  >
                    All
                  </Button>
                  <Button
                    className={1 === filterButton ? 'selectedButton' : ''}
                    style={{ marginRight: '5px' }}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setFilterButton(1);
                      setFilter(1);
                      setSelectState('select');
                      setDistinctValues([]);
                    }}
                  >
                    Past 1h
                  </Button>
                  <Button
                    className={2 === filterButton ? 'selectedButton' : ''}
                    style={{ marginRight: '5px' }}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setFilterButton(2);
                      setFilter(24);
                      setSelectState('select');
                      setDistinctValues([]);
                    }}
                  >
                    Past 24h
                  </Button>
                  <Button
                    className={3 === filterButton ? 'selectedButton' : ''}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setFilterButton(3);
                      setFilter(48);
                      setSelectState('select');
                      setDistinctValues([]);
                    }}
                  >
                    Past 48h
                  </Button>
                </div>
                <div className="card-body" style={{ textAlign: 'center' }}>
                  {filteredBgp.length > 0 ? (
                    <BGPTableComponent asns={asns} data={filteredBgp} />
                  ) : (
                    <div>
                      <p>
                        <img src="checkmark.png"></img>
                      </p>
                      <h3>No bgp updates.</h3>
                    </div>
                  )}
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
                      value={selectState}
                      onChange={onChangeValue.bind(this)}
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
                    {distinctValues.map((value, i) => {
                      if (value !== undefined) {
                        if (
                          selectState === 'origin_as' ||
                          selectState === 'peer_asn'
                        )
                          value = (
                            <>
                              <div data-tip data-for={'origin' + i}>
                                {value}
                              </div>
                              <ReactTooltip html={true} id={'origin' + i}>
                                {ASNTitle[value] ?? ''}
                              </ReactTooltip>
                            </>
                          );
                        return (
                          <Grid key={i} item xs={3}>
                            <Paper className={classes.paper}>{value}</Paper>
                          </Grid>
                        );
                      } else return <> </>;
                    })}
                  </Grid>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default NotAuthHOC(BGPUpdates, ['admin', 'user']);
