import React from 'react';
import Tooltip from '../components/tooltip/tooltip';
import { fetchASNData } from './fetch-data';
import { formatDate, genTooltip } from './token';

export function extractUser(req) {
  if (!req.user) return null;

  const { _id, name, email, role, lastLogin } = req.user;
  return {
    _id,
    name,
    email,
    role,
    lastLogin,
  };
}

export function extractLdapUser(req) {
  if (!req.user) return null;

  const mail = req.user[process.env.LDAP_EMAIL_FIELDNAME];

  req.db.collection('users').updateOne(
    {
      email: mail,
    },
    {
      $set: {
        name: mail,
        email: mail,
        password: '<REDUCTED>',
        lastLogin: new Date(),
        currentLogin: new Date(),
        role: 'user', // just for testing. normally it will be 'pending'
      },
    },
    {
      upsert: true,
    }
  );

  return {
    _id: 999,
    name: mail,
    email: mail,
    role: 'user',
    lastLogin: new Date(),
  };
}

export function parseJwt(token) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (e) {
    return null;
  }
}

function hasProperty(name, property) {
  return Object.prototype.hasOwnProperty.call(name, property);
}

function extractCountries(countries) {
  const countries_set = new Set();
  for (const resource in countries.data.located_resources) {
    if (hasProperty(countries.data.located_resources, resource))
      for (const location in countries.data.located_resources[resource]
        .locations) {
        if (
          hasProperty(
            countries.data.located_resources[resource].locations,
            location
          )
        ) {
          if (
            countries.data.located_resources[resource].locations[
              location
            ].country.includes('-')
          ) {
            countries_set.add(
              countries.data.located_resources[resource].locations[
                location
              ].country.split('-')[0]
            );
          } else {
            countries_set.add(
              countries.data.located_resources[resource].locations[location]
                .country
            );
          }
        }
      }
  }
  return countries_set;
}

function extractAbuse(abuse) {
  const abuse_html = [];
  if (abuse.data.authorities && abuse.data.authorities.length > 0) {
    const authorities = [];
    for (const authority in abuse.data.authorities) {
      if (hasProperty(abuse.data.authorities, authority)) {
        authorities.push(abuse.data.authorities[authority]);
      }
    }
    if (authorities) {
      abuse_html.push('Authorities: ');
      abuse_html.push(authorities.join());
      abuse_html.push('</br>');
    }
  }

  if (
    abuse.data.anti_abuse_contacts &&
    abuse.data.anti_abuse_contacts.abuse_c.length > 0
  ) {
    const anti_abuse_contacts_abuse_c_html = [];
    for (const item in abuse.data.anti_abuse_contacts.abuse_c) {
      if (hasProperty(abuse.data.anti_abuse_contacts.abuse_c, item)) {
        const abuse_c_html = [];
        abuse_c_html.push('Description: ');
        abuse_c_html.push(
          abuse.data.anti_abuse_contacts.abuse_c[item].description
        );
        abuse_c_html.push('</br>Key: ');
        abuse_c_html.push(abuse.data.anti_abuse_contacts.abuse_c[item].key);
        abuse_c_html.push('</br>Email: ');
        abuse_c_html.push(abuse.data.anti_abuse_contacts.abuse_c[item].email);
        abuse_c_html.push('</br>');
        anti_abuse_contacts_abuse_c_html.push(abuse_c_html.join(''));
      }
    }
    if (anti_abuse_contacts_abuse_c_html.length > 0) {
      for (const entry in anti_abuse_contacts_abuse_c_html) {
        if (hasProperty(anti_abuse_contacts_abuse_c_html, entry)) {
          abuse_html.push(anti_abuse_contacts_abuse_c_html[entry]);
          abuse_html.push('</br>');
        }
      }
    }
  }

  return abuse_html;
}

function extractInnerHTML(data_, ASN_int) {
  const html = [];
  const inner_html = [];
  html.push('<p class="tooltip-custom-margin">ASN: ');
  inner_html.push('ASN: ');
  inner_html.push(ASN_int);
  inner_html.push(' (ASN-DOT: ');
  inner_html.push(data_['asn_dot']);
  inner_html.push(')</br>');
  inner_html.push('Name: ');
  inner_html.push(data_['name']);
  inner_html.push('<br>Type: ');
  inner_html.push(data_['type']);
  inner_html.push('</br>Countries operating: ');
  inner_html.push(data_['countries']);
  inner_html.push('<br></br>Abuse Contact Details: </br>');
  inner_html.push(data_['abuse_html']);

  html.push(inner_html.join(''));
  html.push('<small>(Click on AS number to copy on clickboard)</small>');
  html.push('</p>');

  return html;
}

export function parseASNData(ASN_int, name, countries, abuse) {
  const data_ = {};
  data_['name'] = name.data.names ? name.data.names[ASN_int] : '';

  data_['countries'] = Array.from(extractCountries(countries)).join(', ');
  data_['asn_dot'] = ASN_int / 65536 + '.' + (ASN_int % 65536);

  if (
    (ASN_int >= 64512 && ASN_int <= 65534) ||
    (ASN_int >= 4200000000 && ASN_int <= 4294967294)
  ) {
    data_['type'] = 'Private';
  } else {
    data_['type'] = 'Non-Private';
  }

  data_['abuse_html'] = extractAbuse(abuse).join('');
  data_['abuse_text'] = data_['abuse_html'].replace(/<\/br>/g, '\n');

  const join_text = extractInnerHTML(data_, ASN_int).join(''); //.replace(/<\/br>|<br>/g, '\n');

  return join_text;
}

function extractHijackInfoLeft(hijack, { tooltips, setTooltips, context }) {
  const hijackInfo = {
    'Hijacker AS:': [
      <Tooltip
        tooltips={tooltips}
        setTooltips={setTooltips}
        asn={hijack.hijack_as}
        html={
          <input
            id="info_type"
            className="form-control"
            type="text"
            readOnly={true}
            value={hijack.hijack_as ?? ''}
          />
        }
        label={`hijack_as`}
        context={context}
      />,
      genTooltip(
        'Hijacker AS:',
        null,
        'hijack_title_info',
        'The AS that is potentially responsible for the hijack.</br>Note that this is an experimental field.'
      ),
    ],
    Type: [
      hijack.type,
      genTooltip(
        'Type:',
        null,
        'type_title_info',
        `The type of the hijack in 4 dimensions: prefix|path|data plane|policy<ul>
      <li>[Prefix] "S" → Sub-prefix hijack</li>
      <li>[Prefix] "E" → Exact-prefix hijack</li>
      <li>[Prefix] "Q" → Squatting hijack</li>
      <li>[Path] "0" → Type-0 hijack</li>
      <li>[Path] "1" → Type-1 hijack</li>
      <li>[Path] "P" → Type-P hijack</li>
      <li>[Path] "-" → Type-N or Type-U hijack (N/A)</li>
      <li>[Data plane] "-" → Blackholing, Imposture or MitM hijack (N/A)</li>
      <li>[Policy] "L" → Route Leak due to no-export policy violation</li>
      <li>[Policy] "-" → Other policy violation (N/A)</li></ul>`
      ),
    ],
    '# Peers Seen': [
      hijack.num_peers_seen,
      genTooltip(
        '# Peers Seen:',
        null,
        'peers_title_info',
        `Number of peers/monitors (i.e., ASNs)</br>that have seen hijack updates.`
      ),
    ],
    '# ASes Infected': [
      hijack.num_asns_inf,
      genTooltip(
        '# ASes Infected:',
        null,
        'infected_title_info',
        `Number of infected ASes that seem to</br>route traffic towards the hijacker AS.</br>Note that this is an experimental field.`
      ),
    ],
    Prefix: [
      hijack.prefix,
      genTooltip(
        'Prefix:',
        null,
        'prefix_title_info',
        `The IPv4/IPv6 prefix related to the BGP update.`
      ),
    ],
    Matched: [
      hijack.configured_prefix,
      genTooltip(
        'Matched:',
        null,
        'matched_title_info',
        `The prefix that was matched in the configuration (note: this might differ from the actually hijacked prefix in the case of a sub-prefix hijack).`
      ),
    ],
    Config: [
      formatDate(new Date(hijack.timestamp_of_config)),
      genTooltip(
        'Config:',
        null,
        'config_title_info',
        `The timestamp (i.e., unique ID) of the configuration based on which this hijack event was triggered.`
      ),
    ],
    Key: [
      hijack.key,
      genTooltip(
        'Key:',
        null,
        'key_title_info',
        `The unique key of a hijack event.`
      ),
    ],
  };
  return hijackInfo;
}
function extractHijackInfoRight(hijack) {
  const hijackInfo = {
    'Time Started': [
      formatDate(new Date(hijack.time_started)),
      genTooltip(
        'Time Started:',
        null,
        'timestart_title_info',
        `The timestamp of the oldest known (to the system) BGP update that is related to the hijack.`
      ),
    ],
    'Time Detected': [
      formatDate(new Date(hijack.time_detected)),
      genTooltip(
        'Time Detected:',
        null,
        'timedetect_title_info',
        `The time when a hijack event was first detected by the system.`
      ),
    ],
    'Last Update': [
      formatDate(new Date(hijack.time_last)),
      genTooltip(
        'Last Update:',
        null,
        'lastupdate_title_info',
        `The timestamp of the newest known (to the system) BGP update that is related to the hijack.`
      ),
    ],
    'Time Ended': [
      formatDate(new Date(hijack.time_ended)),
      genTooltip(
        'Time Ended:',
        null,
        'timeended_title_info',
        `The timestamp when the hijack was ended. It can be set in the following ways:
      <ul><li>Manually, when the user presses the “resolved” button.</li>
      <li>Automatically, when a hijack is completely withdrawn (all monitors that saw hijack updates for a certain prefix have seen the respective withdrawals).</li></ul>`
      ),
    ],
    'Mitigation Started': [
      hijack.mitigation_started ?? 'Never',
      genTooltip(
        'Mitigation Started:',
        null,
        'mitigationstarted_title_info',
        `The timestamp when the mitigation was triggered by the user (“mitigate” button).`
      ),
    ],
    'Community Annotation': [
      hijack.community_annotation,
      genTooltip(
        'Community Annotation:',
        null,
        'communityannotation_title_info',
        `The user-defined annotation of the hijack according to the communities of hijacked BGP updates.`
      ),
    ],
    'RPKI Status': [
      hijack.rpki_status,
      genTooltip(
        'RPKI Status:',
        null,
        'rpkistatus_title_info',
        `The RPKI status of the hijacked prefix.<ul>
      <li>"NA" → Non Applicable</li>
      <li>"VD" → Valid</li>
      <li>"IA" → Invalid ASN</li>
      <li>"IL" → Invalid Prefix Length</li>
      <li>"IU" → Invalid Unknown</li>
      <li>"NF" → Not found</li></ul>`
      ),
    ],
    'Display Peers Seen Hijack': [
      <></>,
      <span>
        <br />
        Display Peers Seen Hijack
      </span>,
    ],
  };

  return hijackInfo;
}
export function extractHijackInfos(hijack, contextData) {
  return [
    extractHijackInfoLeft(hijack, contextData),
    extractHijackInfoRight(hijack),
  ];
}

export async function extractWithDrawnSeen(withdrawn, seen) {
  const tooltipsWithdrawn = [];
  const tooltipsSeen = [];
  const waitData1 = [];
  const waitData2 = [];

  for (let i = 0; i < withdrawn.length; i++) {
    waitData1.push(await fetchASNData(withdrawn[i]));
    tooltipsWithdrawn.push(
      parseASNData(
        withdrawn[i],
        waitData1[i][0],
        waitData1[i][1],
        waitData1[i][2]
      )
    );
  }

  for (let i = 0; i < seen.length; i++) {
    waitData2.push(await fetchASNData(seen[i]));
    tooltipsSeen.push(
      parseASNData(seen[i], waitData2[i][0], waitData2[i][1], waitData2[i][2])
    );
  }
  return {
    tooltipsWithdrawn: tooltipsWithdrawn,
    tooltipsSeen: tooltipsSeen,
  };
}

export async function extractDistinctTooltips(asns) {
  const tooltips = {};

  for (let i = 0; i < asns.length; i++) {
    const ASN_int: number | string =
      asns[i] !== '-' ? parseInt(asns[i], 10) : '-';
    const [name_origin, countries_origin, abuse_origin] =
      ASN_int == '-'
        ? ['', '', '']
        : await fetchASNData(parseInt(ASN_int.toString(), 10));

    const tooltip =
      ASN_int == '-'
        ? ''
        : parseASNData(ASN_int, name_origin, countries_origin, abuse_origin);
    tooltips[ASN_int] = tooltip;
  }

  return tooltips;
}

export async function extractHijackTooltips(hijack) {
  const ASN_int_origin: number = hijack.hijack_as;
  const ASN_int_peers: number = hijack.peers_seen;

  const [name_origin, countries_origin, abuse_origin] =
    ASN_int_origin && ASN_int_origin.toString() !== '-'
      ? await fetchASNData(ASN_int_origin)
      : ['', '', ''];
  const [name_peers, countries_peers, abuse_peers] =
    ASN_int_peers && ASN_int_peers.toString() !== '-'
      ? await fetchASNData(ASN_int_peers)
      : ['', '', ''];

  const tooltip1 =
    ASN_int_origin && ASN_int_origin.toString() !== '-'
      ? parseASNData(
          ASN_int_origin,
          name_origin,
          countries_origin,
          abuse_origin
        )
      : '';

  const tooltip2 =
    ASN_int_peers && ASN_int_peers.toString() !== '-'
      ? parseASNData(ASN_int_peers, name_peers, countries_peers, abuse_peers)
      : '';

  return [tooltip1, tooltip2];
}
