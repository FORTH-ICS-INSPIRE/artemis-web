const getRandomString = (len) => {
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

export const getCookie = (name) => {
  var dc = document.cookie;
  var prefix = name + '=';
  var begin = dc.indexOf('; ' + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(';', begin);
    if (end == -1) {
      end = dc.length;
    }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
};
export const setCookie = (cname, cvalue, exHours) => {
  var d = new Date();
  d.setTime(d.getTime() + exHours * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
};

export default getRandomString;
