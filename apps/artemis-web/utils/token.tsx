import React, { ReactElement } from 'react';
import ReactTooltip from 'react-tooltip';
import { Comparator, textFilter } from 'react-bootstrap-table2-filter';

export const getRandomString = (len: number): string => {
  const buf = [],
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    charlen = chars.length;

  for (let i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

export const isNumeric = (str: string): boolean => {
  // if (typeof str != 'string') return false; // we only process strings!
  return !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
};

const getRandomInt = (min, max): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const appendLeadingZeroes = (n: number): string => {
  if (n <= 9) {
    return '0' + n;
  }
  return n.toString();
};

export const formatDate = (date: Date, incr = 0): string => {
  const newDate = new Date(date.toUTCString());
  newDate.setHours(newDate.getHours() + incr);

  const today = new Date();
  const isToday =
    newDate.getDate() === today.getDate() &&
    newDate.getMonth() === today.getMonth() &&
    newDate.getFullYear() === today.getFullYear();

  const isYesterday =
    newDate.getDate() === today.getDate() - 1 &&
    newDate.getMonth() === today.getMonth() &&
    newDate.getFullYear() === today.getFullYear();

  const parsedDate = isToday
    ? 'Today'
    : isYesterday
      ? 'Yesterday'
      : newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();

  return (
    parsedDate +
    ' ' +
    appendLeadingZeroes(newDate.getHours()) +
    ':' +
    appendLeadingZeroes(newDate.getMinutes()) +
    ':' +
    appendLeadingZeroes(newDate.getSeconds())
  );
};

export const diffDate = (date1: Date, date2: Date): string => {
  const ms = date2.getTime() - date1.getTime();
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const daysms = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysms / (60 * 60 * 1000));
  const hoursms = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursms / (60 * 1000));
  const minutesms = ms % (60 * 1000);
  const sec = Math.floor(minutesms / 1000);
  return days + 'D ' + hours + 'H ' + minutes + 'M ' + sec + 'S';
};

export const fromEntries = (xs: [string | number | symbol, any][]): any =>
  xs.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

export const genTooltip = (
  column: any,
  components: any,
  label: string,
  text: string,
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

export const isObjectEmpty = (o: any): boolean => Object.keys(o).length === 0;

const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';
const isBrowser = (): boolean => typeof window !== 'undefined';
export const shallMock = (): boolean => isDevelopment() && isBrowser();

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

export const compareObjects = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object' ||
    obj1 == null ||
    obj2 == null
  ) {
    return false;
  }

  const keysA = Object.keys(obj1);
  const keysB = Object.keys(obj2);

  if (keysA.length !== keysB.length) {
    return false;
  }

  let result = true;

  keysA.forEach((key) => {
    if (!keysB.includes(key)) {
      result = false;
    }

    if (typeof obj1[key] === 'function' || typeof obj2[key] === 'function') {
      if (obj1[key].toString() !== obj2[key].toString()) {
        result = false;
      }
    }

    if (!compareObjects(obj1[key], obj2[key])) {
      result = false;
    }
  });

  return result;
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

export const findStatus = (row: any): string[] => {
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

export const getSortCaret = (order: string): any => {
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

export const getSeen = (hijackDataState: any): any =>
  hijackDataState ? hijackDataState.peers_seen ?? [] : [];

export const isResolved = (hijackDataState): boolean =>
  hijackDataState?.resolved;

export const isIgnored = (hijackDataState): boolean => hijackDataState?.ignored;

export const isUnderMitigation = (hijackDataState): boolean =>
  hijackDataState?.under_mitigation;

export const isSeen = (hijackDataState): boolean =>
  hijackDataState && hijackDataState.seen;

export const getExactMatchFilter = (stateValue, fieldName) =>
  textFilter({
    placeholder: fieldName, // custom the input placeholder
    className: 'my-custom-text-filter', // custom classname on input
    defaultValue: stateValue, // default filtering value
    comparator: Comparator.EQ, // default is Comparator.LIKE
    caseSensitive: true, // default is false, and true will only work when comparator is LIKE
    style: {}, // your custom styles on input
    delay: 1000, // how long will trigger filtering after user typing, default is 500 ms
    id: 'id', // assign a unique value for htmlFor attribute, it's useful when you have same dataField across multiple table in one page
  });

export const getTextFilter = (stateValue, fieldName) =>
  textFilter({
    placeholder: fieldName, // custom the input placeholder
    defaultValue: stateValue, // default filtering value
  });

export const expandColumnComponent = ({
  expanded,
  rowKey,
  expandable,
}: any): ReactElement => {
  let content: JSX.Element = <></>;

  if (expandable) {
    content = expanded ? (
      <img alt="" src="details_close.png" />
    ) : (
      <img alt="" src="details_open.png" />
    );
  }

  return <div> {content} </div>;
};

export const expandedColumnHeaderComponent = (): ReactElement<any, any> => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      More
    </div>
  );
};

export const exportHijack = async (hijack_key: string, _csrf: string): Promise<void> => {
  const res = await fetch('/api/download_tables', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'view_hijacks',
      _csrf: _csrf,
      parameters: '(key.eq.' + hijack_key + ')',
    }),
  });

  function download(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  const data = await res.json();
  download(JSON.stringify(data), 'data.json', 'text/json');
};

export const GLOBAL_MEDIA_QUERIES = {
  pc: '(min-width: 700px)',
  mobile: '(max-width: 700px)',
};

export const autoLogout = (props: any): void => {
  const events = [
    'load',
    'mousemove',
    'mousedown',
    'click',
    'scroll',
    'keypress',
  ];
  const time = parseInt(props._inactivity_timeout, 10);

  let warnTimeout: any;
  let logoutTimeout: any;

  for (const i in events) {
    if (Object.prototype.hasOwnProperty.call(events, i))
      window.addEventListener(events[i], resetTimeout);
  }

  setTimeout2();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _csrf: props._csrf }),
    });

    document.location.href = '/login';
  };

  function clearTimeout2() {
    if (warnTimeout) clearTimeout(warnTimeout);

    if (logoutTimeout) clearTimeout(logoutTimeout);
  }

  function setTimeout2() {
    warnTimeout = setTimeout(warn, (1000 * time) / 2);
    logoutTimeout = setTimeout(logout, 1000 * time);
  }

  function resetTimeout() {
    clearTimeout2();
    setTimeout2();
  }

  function warn() {
    alert(`You will be logged out automatically in ${time / 2} seconds.`);
  }

  function logout() {
    // Send a logout request to the API
    destroy();
    handleLogout();
  }

  function destroy() {
    clearTimeout();

    for (const i in events) {
      if (Object.prototype.hasOwnProperty.call(events, i))
        window.removeEventListener(events[i], resetTimeout);
    }
  }
};
