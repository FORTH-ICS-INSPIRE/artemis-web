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
            timestamp: '2020-08-04T13:41:01.2861',
            __typename: 'view_processes',
          },
          {
            name: 'mitigation',
            running: false,
            loading: false,
            timestamp: '2020-03-04T13:54:10.2861',
            __typename: 'view_processes',
          },
          {
            name: 'monitor',
            running: false,
            loading: false,
            timestamp: '2020-01-04T13:44:28.29838',
            __typename: 'view_processes',
          },
          {
            name: 'configuration',
            running: true,
            loading: false,
            timestamp: '2020-05-04T13:44:18.626747',
            __typename: 'view_processes',
          },
          {
            name: 'clock',
            running: true,
            loading: false,
            timestamp: '2020-02-04T13:42:08.658648',
            __typename: 'view_processes',
          },
          {
            name: 'observer',
            running: true,
            loading: false,
            timestamp: '2019-11-04T13:03:02.658943',
            __typename: 'view_processes',
          },
          {
            name: 'database',
            running: true,
            loading: false,
            timestamp: '2019-12-04T13:44:19.725199',
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
            communities: ['a'],
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
  graphql.query('getIndexAllStats', (req, res, ctx) => {
    return res(
      ctx.data({
        view_index_all_stats: [
          {
            monitored_prefixes: 3,
            configured_prefixes: 4,
            monitor_peers: 416,
            total_bgp_updates: 1242,
            total_unhandled_updates: 0,
            total_hijacks: 1,
            ignored_hijacks: 0,
            resolved_hijacks: 0,
            withdrawn_hijacks: 1,
            mitigation_hijacks: 0,
            ongoing_hijacks: 0,
            dormant_hijacks: 0,
            acknowledged_hijacks: 0,
            outdated_hijacks: 0,
          },
        ],
      })
    );
  }),
  graphql.query('getHijackByKey', (req, res, ctx) => {
    return res(
      ctx.data({
        view_hijacks: [
          {
            key: '79e522e81453a3a439aa581aab3e93e2',
            type: 'E|0|-|-',
            prefix: '139.91.250.0/24',
            hijack_as: 264409,
            num_peers_seen: 1,
            num_asns_inf: 0,
            time_started: '2020-08-24T05:50:07.968767',
            time_ended: '2020-08-24T16:53:44.457036',
            time_last: '2020-08-24T16:53:44.457036',
            mitigation_started: null,
            time_detected: '2020-08-24T06:01:50.275152',
            timestamp_of_config: '2020-07-23T16:50:27.000966',
            under_mitigation: false,
            resolved: false,
            active: false,
            dormant: false,
            ignored: false,
            configured_prefix: '139.91.250.0/24',
            comment: 'this is a sample comment',
            seen: false,
            withdrawn: true,
            peers_withdrawn: [264409],
            peers_seen: [264409],
            outdated: false,
            community_annotation: 'NA',
            rpki_status: 'IA',
          },
        ],
      })
    );
  }),
  graphql.query('getBGPByKey', (req, res, ctx) => {
    return res(
      ctx.data({
        view_data: [
          {
            prefix: '139.91.250.0/24',
            origin_as: '-',
            peer_asn: 264409,
            as_path: [],
            service: 'implicit-withdrawal',
            type: 'W',
            communities: [],
            timestamp: '2020-08-24T16:53:44.457036',
            hijack_key: ['79e522e81453a3a439aa581aab3e93e2'],
            handled: true,
            matched_prefix: '139.91.250.0/24',
            orig_path: {
              triggering_bgp_update: {
                key: '8345c99d52e3ff23d13af95f92280b69',
                type: 'A',
                prefix: '139.91.250.0/24',
                as_path: [264409, 6939, 56910, 8522],
                handled: false,
                service: 'bgpstreamlive|routeviews|route-views2.saopaulo',
                peer_asn: 264409,
                orig_path: null,
                origin_as: 8522,
                timestamp: 1598288023.457036,
                hijack_key: [],
                communities: [],
                matched_prefix: '139.91.250.0/24',
                path: [264409, 6939, 56910, 8522],
              },
            },
          },
          {
            prefix: '139.91.250.0/24',
            origin_as: 264409,
            peer_asn: 264409,
            as_path: [264409, 6939, 264409],
            service: 'bgpstreamlive|routeviews|route-views2.saopaulo',
            type: 'A',
            communities: [],
            timestamp: '2020-08-24T05:50:07.968767',
            hijack_key: ['79e522e81453a3a439aa581aab3e93e2'],
            handled: true,
            matched_prefix: '139.91.250.0/24',
            orig_path: null,
          },
        ],
      })
    );
  }),
];
