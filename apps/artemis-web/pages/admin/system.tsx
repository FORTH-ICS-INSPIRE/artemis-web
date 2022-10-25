import { Grid } from '@material-ui/core';
import Head from 'next/head';
import React, { useEffect } from 'react';
import AuthHOC from '../../components/401-hoc/401-hoc';
import SystemConfigurationComponent from '../../components/system-configuration/system-configuration';
import SystemModule from '../../components/system-module/system-module';
import { setup } from '../../libs/csrf';
import { useGraphQl } from '../../utils/hooks/use-graphql';
import { autoLogout, shallMock } from '../../utils/token';

const SystemPage = (props) => {
  if (shallMock(props.isTesting)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../../utils/mock-sw/browser');
    worker.start();
  }

  useEffect(() => {
    autoLogout(props);
  }, [props]);

  const user = props.user;
  const STATS_RES: any = useGraphQl('stats', {
    isLive: !shallMock(props.isTesting),
    hasDateFilter: false,
    hasColumnFilter: false,
  });
  const STATS_DATA: any = STATS_RES?.data;

  let CONFIG_DATA: any = useGraphQl('config', {
    isLive: !shallMock(props.isTesting),
    hasDateFilter: false,
    hasColumnFilter: false,
  });
  CONFIG_DATA = CONFIG_DATA?.data;

  const processes = STATS_DATA ? STATS_DATA.view_processes : null;

  const modules = processes
    ? processes.map((ps) => {
      return [
        ps['name'].charAt(0).toUpperCase() + ps['name'].slice(1),
        ps['running'],
      ];
    })
    : [];

  const modulesStateObj = {};
  const modulesList = [
    'riperistap',
    'bgpstreamlivetap',
    'exabgptap',
    'detection',
    'mitigation',
    'bgpstreamhisttap',
    'bgpstreamkafkatap',
  ];
  const modulesLabels = {
    riperistap: 'RIPE RIS Monitor',
    bgpstreamlivetap: 'BGPStream Live Monitor',
    bgpstreamkafkatap: 'BGPStream Kafka Monitor',
    bgpstreamhisttap: 'BGPStream Historical Monitor',
    exabgptap: 'ExaBGP Monitor',
    detection: 'Detection',
    mitigation: 'Mitigation',
  };

  modules.forEach(
    (module) => (modulesStateObj[module[0].toString()] = module[1])
  );

  const moduleNames = Object.keys(modulesStateObj).filter((moduleName) =>
    modulesList.includes(
      moduleName.substring(0, moduleName.indexOf('-')).toLowerCase()
    )
  );

  const subModules = {};
  moduleNames.forEach((moduleName) => {
    const keyL = moduleName.substring(0, moduleName.indexOf('-')).toLowerCase();
    if (keyL in subModules) {
      subModules[keyL].push([
        moduleName.toLowerCase(),
        modulesStateObj[moduleName],
      ]);
    } else {
      subModules[keyL] = [
        [moduleName.toLowerCase(), modulesStateObj[moduleName]],
      ];
    }
  });

  moduleNames.sort();

  const moduleList = [];

  return (
    <>
      <Head>
        <title>ARTEMIS - System</title>
      </Head>
      <div id="page-container">
        {user && modulesStateObj && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="row">
                  <div className="col-lg-8">
                    <h1 style={{ color: 'black' }}>System</h1>{' '}
                  </div>
                  <div className="col-lg-1"></div>
                </div>
                <hr style={{ backgroundColor: 'white' }} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <Grid container spacing={3}>
                  {moduleNames.map((module, i) => {
                    const key = module
                      .substring(0, module.indexOf('-'))
                      .toLowerCase();
                    if (!moduleList.includes(key)) {
                      moduleList.push(key);
                      return (
                        <SystemModule
                          {...props}
                          key={i} // React requires a unique key value for each component rendered within a loop
                          module={module}
                          subModules={subModules}
                          labels={modulesLabels}
                          modulesStateObj={modulesStateObj}
                          is
                        />
                      );
                    } else return <> </>;
                  })}
                </Grid>
              </div>
            </div>
            <SystemConfigurationComponent
              {...props}
              CONFIG_DATA={CONFIG_DATA}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AuthHOC(SystemPage, ['admin']);

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return { props: { _csrf: csrftoken, isTesting: process.env.TESTING === 'true', _inactivity_timeout: process.env.INACTIVITY_TIMEOUT, system_version: process.env.SYSTEM_VERSION } };
});
