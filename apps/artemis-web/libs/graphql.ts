import {
  ApolloClient,
  createHttpLink,
  DocumentNode,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useMemo } from 'react';
import queryType from './graphql.d';

let accessToken = null;
const requestToken = async () => {
  if (!accessToken) {
    const res = await fetch('/api/auth/jwt');
    accessToken = await res.json();
    accessToken = accessToken.accessToken;
  }
};

let apolloClient: ApolloClient<NormalizedCacheObject>;

const createApolloClient = () => {
  const httpLink =
    typeof window !== 'undefined'
      ? createHttpLink({
        uri: `https://${window.location.hostname}:${window.location.port}/api/graphql`,
        useGETForQueries: false,
      })
      : null;

  const authLink =
    typeof window !== 'undefined'
      ? setContext(async (_, { headers }) => {
        await requestToken();
        return {
          headers: {
            ...headers,
            authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        };
      })
      : null;

  const wsLink =
    typeof window !== 'undefined'
      ? new WebSocketLink({
        uri: `wss://${window.location.hostname}:${window.location.port}/api/graphql`,
        options: {
          reconnect: true,
          lazy: true,
          connectionParams: async () => {
            await requestToken();
            return {
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            };
          },
        },
      })
      : null;

  const splitLink =
    typeof window !== 'undefined'
      ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        authLink.concat(httpLink)
      )
      : null;

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = (initialState = null): any => {
  const _apolloClient = apolloClient ?? createApolloClient();
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window !== 'undefined') return _apolloClient;
  apolloClient = apolloClient ?? _apolloClient;

  return apolloClient;
};

export class QueryGenerator {
  [x: string]: any;
  type: queryType;
  isSubscription: boolean;
  operationType: string;
  constructor(type: queryType, isSubscription: boolean, options: any = {}) {
    this.type = type;
    this.isSubscription = isSubscription;
    this.operationType = isSubscription ? 'subscription' : 'query';
    this.options = options;
  }

  private setModuleState() {
    return gql`
      mutation updateIntendedProcessStates($name: String, $running: Boolean) {
        update_view_intended_process_states(
          where: { name: { _eq: $name } }
          _set: { running: $running }
        ) {
          affected_rows
          returning {
            name
            running
          }
        }
      }
    `;
  }

  private getHijacksQuery() {
    return gql`
    ${this.operationType} hijacks${this.getQueryVars()} {
      view_hijacks(
        ${this.getConditionLimit()}
        ${this.getWhereCondition(false, 'time_last', '', 'hijacks')}
        order_by: { ${this.options.sortColumn}: ${this.options.sortOrder} }
      ) {
        active
        comment
        configured_prefix
        hijack_as
        ignored
        dormant
        key
        rpki_status
        mitigation_started
        num_asns_inf
        num_peers_seen
        outdated
        peers_seen
        peers_withdrawn
        prefix
        resolved
        seen
        time_detected
        time_ended
        time_last
        time_started
        timestamp_of_config
        type
        under_mitigation
        withdrawn
      }
    }`;
  }

  private getBgpCountQuery() {
    let args = '';
    if (this.options.hasColumnFilter) {
      const column = Object.keys(this.options.columnFilter)[0];
      const filterValue = this.options.columnFilter[column].filterVal;

      if (column === 'as_path2')
        args = 'args: {as_paths: "{' + filterValue + '}" }';
    }

    return gql`
            ${this.operationType} getLiveTableCount {
              count_data: ${args.length
        ? 'search_bgpupdates_as_path_aggregate'
        : 'view_bgpupdates_aggregate'
      } ${this.getWhereCondition(
        this.options.hasDateFilter || this.options.hasColumnFilter,
        'timestamp',
        args
      )}
              {
                aggregate {
                  count
                }
              }
            }`;
  }

  private getHijacksCountQuery() {
    return gql`
            ${this.operationType} getLiveTableCount {
              count_data: view_hijacks_aggregate${this.getWhereCondition(
      true,
      'time_last',
      '',
      'hijacks'
    )}
              { aggregate { count } }
            }`;
  }

  private getHijackByKey() {
    return gql`
      ${this.operationType} getHijackByKey($key: String!) {
        view_hijacks(where: { key: { _eq: $key } }, limit: 1) {
          key
          type
          prefix
          hijack_as
          num_peers_seen
          num_asns_inf
          time_started
          time_ended
          time_last
          mitigation_started
          time_detected
          timestamp_of_config
          under_mitigation
          resolved
          active
          dormant
          ignored
          configured_prefix
          comment
          seen
          withdrawn
          peers_withdrawn
          peers_seen
          outdated
          community_annotation
          rpki_status
        }
      }
    `;
  }

  private getStatusQuery() {
    return gql`
    ${this.operationType} getStats {
      view_processes {
        name
        running
        loading
        timestamp
      }
    }
  `;
  }

  private getStatisticsQuery() {
    return gql`
      ${this.operationType} getIndexAllStats {
        view_index_all_stats {
          monitored_prefixes
          configured_prefixes
          monitor_peers
          total_bgp_updates
          total_unhandled_updates
          total_hijacks
          ignored_hijacks
          resolved_hijacks
          withdrawn_hijacks
          mitigation_hijacks
          ongoing_hijacks
          dormant_hijacks
          acknowledged_hijacks
          outdated_hijacks
        }
      }
    `;
  }
  private getBGPUpdates() {
    let args = '';
    if (this.options.hasColumnFilter) {
      const column = Object.keys(this.options.columnFilter)[0];
      const filterValue = this.options.columnFilter[column].filterVal;

      if (column === 'as_path2')
        args = 'args: {as_paths: "{' + filterValue + '}" }';
    }

    return gql`
      ${this.operationType} bgpupdates${this.getQueryVars()} {
      view_bgpupdates${args.length ? ': search_bgpupdates_as_path' : ''}(
        ${this.getConditionLimit()}
        ${this.getWhereCondition()}
        ${args}
        order_by: { timestamp: ${this.options.sortOrder} }
      ) {
        prefix
        origin_as
        peer_asn
        as_path
        service
        type
        communities
        timestamp
        hijack_key
        handled
        matched_prefix
        orig_path
      }
    }`;
  }

  private getDataplaneQuery() {
    return gql`${this.operationType} getDataplane${this.getQueryVars()} {
      view_dataplane_msms(
        order_by: {${this.options.sortColumn}: ${this.options.sortOrder}}
        ${this.getConditionLimit()}
        where: {hijack_key: {_eq: \"${this.options.key}\"}}) {
        msm_id
        msm_type
        msm_protocol
        msm_start_time
        msm_stop_time
        target_ip
        num_of_probes
        hijacker_as
        hijacked
      }
    }`;
  }

  private getBGPUpdatesByKey() {
    let args = '';
    if (this.options.hasColumnFilter) {
      const column = Object.keys(this.options.columnFilter)[0];
      const filterValue = this.options.columnFilter[column].filterVal;

      if (column === 'as_path2') args = ', as_paths: "{' + filterValue + '}"';
    }

    return gql`${this.operationType
      } getLiveTableData${this.getQueryVars()} { view_bgpupdates: ${args.length
        ? 'search_bgpupdates_by_as_path_and_hijack_key'
        : 'search_bgpupdates_by_hijack_key'
      }(
         order_by: {timestamp: ${this.options.sortOrder}}
         ${this.getConditionLimit()}
         ${this.getWhereCondition()}
         args: {key: \"${this.options.key}\" ${args}}) {
            prefix origin_as peer_asn as_path service type communities timestamp hijack_key handled matched_prefix orig_path
          }}`;
  }

  private getBGPCountByKey() {
    let args = '';
    if (this.options.hasColumnFilter) {
      const column = Object.keys(this.options.columnFilter)[0];
      const filterValue = this.options.columnFilter[column].filterVal;

      if (column === 'as_path2') args = ', as_paths: "{' + filterValue + '}"';
    }
    return gql`
    ${this.operationType} getLiveTableCount($key: String!) {
      count_data: ${args.length
        ? 'search_bgpupdates_by_as_path_and_hijack_key_aggregate'
        : 'search_bgpupdates_by_hijack_key_aggregate'
      }(
        ${this.getWhereCondition()}
        args: {key: $key ${args}}) {
           aggregate {
             count
           }
        } }
      `;
  }

  private getConfig() {
    return gql`
      ${this.operationType} getConfig {
        view_configs(limit: 1, order_by: { time_modified: desc }) {
          raw_config
          comment
          time_modified
        }
      }
    `;
  }

  private getQueryVars() {
    return this.options.limits ? `($offset: Int!, $limit: Int!)` : '';
  }

  private getWhereCondition(
    parenthesis = false,
    dateField = 'timestamp',
    args = '',
    type = ''
  ) {
    if (
      this.options.hasDateFilter ||
      this.options.hasColumnFilter ||
      this.options.statusFilter ||
      this.options.key
    ) {
      let condition = `${parenthesis ? '(' : ''}where: { _and: [`;
      if (this.options.hasDateFilter)
        condition =
          condition +
          `{ ${dateField}: {_gte: "${this.options.dateRange.dateFrom}"} },{ ${dateField}: {_lte: "${this.options.dateRange.dateTo}"} },`;
      if (this.options.hasColumnFilter) {
        Object.keys(this.options.columnFilter).forEach((column) => {
          const filterValue = this.options.columnFilter[column].filterVal;
          if (column.includes('original'))
            column = column.replace('_original', '');
          else if (column === 'as_path2') column = 'as_path';

          if (column === 'service') {
            condition =
              condition + `{ ${column}: {_like: "%${filterValue}%"} }`;
          } else if (column === 'type' && type === 'hijacks') {
            condition =
              condition + `{ ${column}: {_like: "%${filterValue}%"} }`;
          } else if (column !== 'as_path')
            condition =
              condition +
              `{ ${column}: {_eq: "${filterValue.replace(
                / -> |-> | -> |->/gi,
                '|'
              )}"} }`;
        });
      }
      if (this.options.statusFilter) {
        condition = condition + this.options.statusFilter;
      }
      return condition + `] },${args} ${parenthesis ? ')' : ''}`;
    } else return '';
  }

  private getConditionLimit() {
    return this.options.limits
      ? `
      limit: $limit
      offset: $offset`
      : '';
  }

  public getQuery(): DocumentNode {
    let query: DocumentNode = null;
    switch (this.type) {
      case 'stats':
        query = this.getStatusQuery();
        break;
      case 'hijacks':
        query = this.getHijacksQuery();
        break;
      case 'bgpCount':
        query = this.getBgpCountQuery();
        break;
      case 'dataplane':
        query = this.getDataplaneQuery();
        break;
      case 'bgpUpdates':
        query = this.getBGPUpdates();
        break;
      case 'indexStats':
        query = this.getStatisticsQuery();
        break;
      case 'hijackCount':
        query = this.getHijacksCountQuery();
        break;
      case 'hijackByKey':
        query = this.getHijackByKey();
        break;
      case 'bgpByKey':
        query = this.getBGPUpdatesByKey();
        break;
      case 'bgpCountByKey':
        query = this.getBGPCountByKey();
        break;
      case 'config':
        query = this.getConfig();
        break;
      case 'setModuleState':
        query = this.setModuleState();
        break;
    }

    return query;
  }
}

export const useApollo = (initialState: any): any => {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
};
