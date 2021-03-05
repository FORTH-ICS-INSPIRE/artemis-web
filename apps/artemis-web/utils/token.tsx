import React from 'react';
import ReactTooltip from 'react-tooltip';

export const getRandomString = (len): string => {
  const buf = [],
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    charlen = chars.length;

  for (let i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

const getRandomInt = (min, max): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const appendLeadingZeroes = (n): string => {
  if (n <= 9) {
    return '0' + n;
  }
  return n;
};

export const formatDate = (date): string =>
  date.getFullYear() +
  '-' +
  (date.getMonth() + 1) +
  '-' +
  date.getDate() +
  ' ' +
  appendLeadingZeroes(date.getHours()) +
  ':' +
  appendLeadingZeroes(date.getMinutes()) +
  ':' +
  appendLeadingZeroes(date.getSeconds());

export const diffDate = (date1, date2): string => {
  const ms = date2 - date1;
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const daysms = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysms / (60 * 60 * 1000));
  const hoursms = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursms / (60 * 1000));
  const minutesms = ms % (60 * 1000);
  const sec = Math.floor(minutesms / 1000);
  return days + 'D ' + hours + 'H ' + minutes + 'M ' + sec + 'S';
};

export const fromEntries = (xs: [string | number | symbol, any][]) =>
  xs.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

export const genTooltip = (
  column,
  components,
  label,
  text,
  classname = null
): any => (
  <>
    <div data-tip data-for={label}>
      {
        <span>
          {column.text ?? column} {components ? components.sortElement : ''}
        </span>
      }
    </div>
    <ReactTooltip className={classname ?? ''} html={true} id={label}>
      {text}
    </ReactTooltip>
  </>
);

export const isObjectEmpty = (o): boolean => Object.keys(o).length === 0;

const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';
const isBrowser = (): boolean => typeof window !== 'undefined';
export const shallMock = (): boolean => isDevelopment() && isBrowser();

const isProduction = (): boolean => process.env.NODE_ENV === 'production';

export const shallSubscribe = (isLive: boolean): boolean => isLive;

export const getISODate = (filter: number): string => {
  const dateFiltered = new Date();
  if (filter >= 0) {
    dateFiltered.setHours(dateFiltered.getHours() - filter);
    dateFiltered.setSeconds(0, 0);
  }
  return dateFiltered.toISOString();
};
export const statuses = {
  Ongoing: 'danger',
  Dormant: 'secondary',
  Resolved: 'success',
  Ignored: 'warning',
  'Under Mitigation': 'primary',
  Withdrawn: 'info',
  Outdated: 'dark',
};

export const getSimpleDates = (): string[] => {
  const d1 = new Date();
  const d2 = new Date();
  d2.setHours(d2.getHours() - 1);

  const timeNow =
    d1.getFullYear() +
    '-' +
    (d1.getMonth() + 1) +
    '-' +
    d1.getDate() +
    ' ' +
    d1.getHours() +
    ':' +
    d1.getMinutes();
  const timeBefore =
    d2.getFullYear() +
    '-' +
    (d2.getMonth() + 1) +
    '-' +
    d2.getDate() +
    ' ' +
    d2.getHours() +
    ':' +
    d2.getMinutes();
  return [timeBefore, timeNow];
};

export const findStatus = (row): string[] => {
  const statuses = [];

  if (row.withdrawn) statuses.push('Withdrawn');
  if (row.resolved) statuses.push('Resolved');
  if (row.ignored) statuses.push('Ignored');
  if (row.active) statuses.push('Ongoing');
  if (row.dormant) statuses.push('Dormant');
  if (row.under_mitigation) statuses.push('Under Mitigation');
  if (row.outdated) statuses.push('Outdated');

  return statuses;
};

export const getStatusField = (status: string): string => {
  if (status.includes('Ongoing')) return 'active';
  else return status.replace(' ', '_').toLowerCase();
};

export const getSortCaret = (order): any => {
  const isDesc = !order || order === 'desc';

  return (
    <span>
      &nbsp;&nbsp;{!isDesc ? <>&darr;</> : <></>}
      <span style={{ color: 'red' }}>
        {!isDesc ? <>/&uarr;</> : <>&darr;</>}
      </span>
      {isDesc ? <>/&uarr;</> : <></>}
    </span>
  );
};

export const getWithdrawn = (hijackDataState) =>
  hijackDataState ? hijackDataState.peers_withdrawn ?? [] : [];

export const getSeen = (hijackDataState) =>
  hijackDataState ? hijackDataState.peers_seen ?? [] : [];

export const isResolved = (hijackDataState): boolean =>
  hijackDataState?.resolved;

export const isIgnored = (hijackDataState): boolean => hijackDataState?.ignored;

export const isUnderMitigation = (hijackDataState): boolean =>
  hijackDataState?.under_mitigation;

export const isSeen = (hijackDataState): boolean =>
  hijackDataState && hijackDataState.seen;
