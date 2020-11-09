import { graphql } from 'msw';

export const handlers = [
  graphql.query('getStats', (req, res, ctx) => {
    return res(
      ctx.data({
        view_processes: [
          {
            name: 'detection',
            running: false,
            loading: false,
            timestamp: '2020-11-04T13:44:28.2861',
            __typename: 'view_processes',
          },
          {
            name: 'mitigation',
            running: false,
            loading: false,
            timestamp: '2020-11-04T13:44:28.2861',
            __typename: 'view_processes',
          },
          {
            name: 'monitor',
            running: false,
            loading: false,
            timestamp: '2020-11-04T13:44:28.29838',
            __typename: 'view_processes',
          },
          {
            name: 'configuration',
            running: true,
            loading: false,
            timestamp: '2020-11-04T13:44:28.626747',
            __typename: 'view_processes',
          },
          {
            name: 'clock',
            running: true,
            loading: false,
            timestamp: '2020-11-04T13:44:28.658648',
            __typename: 'view_processes',
          },
          {
            name: 'observer',
            running: true,
            loading: false,
            timestamp: '2020-11-04T13:44:28.658943',
            __typename: 'view_processes',
          },
          {
            name: 'database',
            running: true,
            loading: false,
            timestamp: '2020-11-04T13:44:28.725199',
            __typename: 'view_processes',
          },
          {
            name: 'autoignore',
            running: true,
            loading: false,
            timestamp: '2020-11-04T13:44:28.763277',
            __typename: 'view_processes',
          },
        ],
      })
    );
  }),
  graphql.query('hijacks', (req, res, ctx) => {
    return res(
      ctx.data({
        view_hijacks: [
          {
            time_detected: '2020-08-24T06:01:50.275152',
            prefix: '139.91.250.0/24',
            type: 'E|0|-|-',
            hijack_as: 264409,
            rpki_status: 'IA',
            num_peers_seen: 1,
            num_asns_inf: 0,
            key: '79e522e81453a3a439aa581aab3e93e2',
            seen: false,
            withdrawn: true,
            resolved: false,
            ignored: false,
            active: false,
            dormant: false,
            under_mitigation: false,
            outdated: false,
            time_last: '2020-08-24T16:53:44.457036',
            configured_prefix: '139.91.250.0/24',
          },
        ],
      })
    );
  }),
  graphql.query('bgpupdates', (req, res, ctx) => {
    return res(
      ctx.data({
        view_bgpupdates: [
          {
            prefix: '139.91.250.0/24',
            origin_as: 8522,
            peer_asn: 64271,
            as_path: [64271, 6939, 56910, 8522],
            service: 'bgpstreamlive|ris|rrc01',
            type: 'A',
            communities: [],
            timestamp: '2020-11-04T12:07:25',
            hijack_key: [],
            handled: true,
            matched_prefix: '139.91.250.0/24',
            orig_path: null,
          },
          {
            prefix: '2001:648:2c30::/48',
            origin_as: 8522,
            peer_asn: 20811,
            as_path: [20811, 2603, 21320, 5408, 8522],
            service: 'ripe-ris|rrc12',
            type: 'A',
            communities: [],
            timestamp: '2020-11-04T13:54:30.03',
            hijack_key: [],
            handled: true,
            matched_prefix: '2001:648:2c30::/48',
            orig_path: null,
          },
        ],
      })
    );
  }),
];
