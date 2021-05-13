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

export function fetchASNData(ASN: number): Promise<any> {
  if (!ASN) return;

  return Promise.all([getName(ASN), getCountry(ASN), getAbuse(ASN)]);
}

export const fetchTooltip = async (
  ASN: string,
  context: any,
  { setTooltip }: any
): Promise<void> => {
  if (context.tooltips[ASN]) {
    // setTooltips({ ...tooltips, [ASN]: context.tooltips[ASN] });
    setTooltip(context.tooltips[ASN]);
  } else {
    const [name_origin, countries_origin, abuse_origin] =
      ASN === '-'
        ? ['', '', '']
        : await fetchASNData(parseInt(ASN.toString(), 10));

    const tooltip =
      ASN === '-'
        ? ''
        : parseASNData(ASN, name_origin, countries_origin, abuse_origin);
    // setTooltips({ ...tooltips, [ASN]: tooltip });
    context.setTooltips({ ...context.tooltips, [ASN]: tooltip });
    setTooltip(tooltip);
  }
};

export const submitComment = async (
  e,
  { commentRef, hijackKey, _csrf }
): Promise<void> => {
  e.preventDefault();
  const editor: any = commentRef.current;
  const comment = editor.editor.innerText;

  const reqData = {
    action: 'comment',
    key: hijackKey,
    comment: comment,
    _csrf: _csrf,
  };

  await fetch('/api/hijack', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqData),
  });
};

export const sendData = async (
  e,
  { hijackKeys, selectState, state = false, _csrf }: any
) => {
  e.preventDefault();

  const reqData = {
    hijack_keys: hijackKeys,
    action: selectState,
    state: state,
    _csrf: _csrf,
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

export const sendHijackData = async (
  e,
  { hijackKey, selectState, prefix, hijack_as, type, _csrf }
) => {
  e.preventDefault();

  let state = true;

  const map = {
    hijack_action_resolve: 'resolve',
    hijack_action_ignore: 'ignore',
    hijack_action_acknowledge: 'seen',
    hijack_action_acknowledge_not: 'seen',
    hijack_action_delete: 'delete',
    hijack_action_mitigate: 'mitigate',
    hijack_action_unmitigate: 'unmitigate',
  };

  if (selectState === 'hijack_action_acknowledge_not') state = false;

  const reqData = {
    hijack_key: hijackKey,
    action: map[selectState],
    state: state,
    prefix: prefix,
    hijack_as: hijack_as,
    hijack_type: type,
    _csrf: _csrf,
  };

  const res = await fetch('/api/rmq_action', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqData),
  });

  if (res.status === 200 && selectState === 'hijack_action_delete')
    window.location.replace('/hijacks');
};
