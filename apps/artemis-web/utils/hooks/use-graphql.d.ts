type limitsType = {
  offset: number;
  limit: number;
};

type dateRangeType = {
  dateFrom: string;
  dateTo: string;
};

type optionsType = {
  isLive: boolean;
  key?: string;
  limits?: limitsType;
  hasDateFilter?: boolean;
  dateRange?: dateRangeType;
  callback?: (data: any) => void;
  sortOrder?: string;
  sortColumn?: string;
  columnFilter?: any;
  hasColumnFilter?: boolean;
  hasStatusFilter?: boolean;
  statusFilter?: string;
  isMutation?: boolean;
  running?: boolean;
  name?: string;
  isTesting?: boolean;
  alert?: any;
};

export default optionsType;
