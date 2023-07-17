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
  | 'setModuleExtraInfo'
  | 'dataplane'
  | 'hijackCount';

export default queryType;
