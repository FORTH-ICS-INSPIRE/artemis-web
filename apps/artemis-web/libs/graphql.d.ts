type queryType =
  | 'stats'
  | 'hijacks'
  | 'hijack'
  | 'bgpUpdates'
  | 'hijackByKey'
  | 'bgpByKey'
  | 'indexStats'
  | 'config'
  | 'bgpCount'
  | 'bgpCountByKey'
  | 'config'
  | 'hijackCount';

export default queryType;
