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
  | 'moduleState'
  | 'setModuleState'
  | 'hijackCount';

export default queryType;
