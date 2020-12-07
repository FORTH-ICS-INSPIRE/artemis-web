import React from 'react';
import ReactTooltip from 'react-tooltip';

export const getRandomString = (len) => {
  const buf = [],
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    charlen = chars.length;

  for (let i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const appendLeadingZeroes = (n) => {
  if (n <= 9) {
    return '0' + n;
  }
  return n;
};

export const formatDate = (date) =>
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

export const diffDate = (date1, date2) => {
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

export const genTooltip = (column, components, label, text): any => (
  <>
    <div data-tip data-for={label}>
      {
        <span>
          {column.text ?? column} {components ? components.sortElement : ''}
        </span>
      }
    </div>
    <ReactTooltip html={true} id={label}>
      {text}
    </ReactTooltip>
  </>
);
