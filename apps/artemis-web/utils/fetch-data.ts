import { parseASNData } from './parsers';

function getName(ASN: number) {
  return fetch(
    'https://stat.ripe.net/data/as-names/data.json?resource=AS' + ASN
  ).then((response) => response.json());
}

function getCountry(ASN: number) {
  return fetch(
    'https://stat.ripe.net/data/maxmind-geo-lite-announced-by-as/data.json?resource=AS' +
      ASN
  ).then((response) => response.json());
}

function getAbuse(ASN: number) {
  return fetch(
    'https://stat.ripe.net/data/abuse-contact-finder/data.json?resource=AS' +
      ASN
  ).then((response) => response.json());
}

export function fetchASNData(ASN: number) {
  if (!ASN) return;

  return Promise.all([getName(ASN), getCountry(ASN), getAbuse(ASN)]);
}

export const fetchTooltip = async (ASN, context, { setTooltip }) => {
  if (context.tooltips[ASN]) {
    // setTooltips({ ...tooltips, [ASN]: context.tooltips[ASN] });
    setTooltip(context.tooltips[ASN]);
  } else {
    const [name_origin, countries_origin, abuse_origin] =
      ASN == '-'
        ? ['', '', '']
        : await fetchASNData(parseInt(ASN.toString(), 10));

    const tooltip =
      ASN == '-'
        ? ''
        : parseASNData(ASN, name_origin, countries_origin, abuse_origin);
    // setTooltips({ ...tooltips, [ASN]: tooltip });
    context.setTooltips({ ...context.tooltips, [ASN]: tooltip });
    setTooltip(tooltip);
  }
};

export const submitComment = async (e, { commentRef, hijackKey }) => {
  e.preventDefault();
  const editor: any = commentRef.current;
  const comment = editor.editor.innerText;

  const reqData = {
    action: 'comment',
    key: hijackKey,
    comment: comment,
  };

  const res = await fetch('/api/hijack', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqData),
  });
};

export const sendData = async (e, { hijackKeys, selectState }) => {
  e.preventDefault();

  const state = false;

  const reqData = {
    hijack_keys: hijackKeys,
    action: selectState,
    state: state,
  };

  const res = await fetch('/api/hijack', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqData),
  });

  if (res.status === 200) window.location.reload();
};
