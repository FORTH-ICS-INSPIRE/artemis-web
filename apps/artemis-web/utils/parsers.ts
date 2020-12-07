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

export function parseASNData(ASN_int, name, countries, abuse) {
  const data_ = {};
  data_['name'] = name.data.names ? name.data.names[ASN_int] : '';

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
  data_['countries'] = Array.from(countries_set).join(', ');
  data_['asn_dot'] = ASN_int / 65536 + '.' + (ASN_int % 65536);

  if (
    (ASN_int >= 64512 && ASN_int <= 65534) ||
    (ASN_int >= 4200000000 && ASN_int <= 4294967294)
  ) {
    data_['type'] = 'Private';
  } else {
    data_['type'] = 'Non-Private';
  }
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
  data_['abuse_html'] = abuse_html.join('');
  data_['abuse_text'] = data_['abuse_html'].replace(/<\/br>/g, '\n');

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

  const join_text = inner_html.join(''); //.replace(/<\/br>|<br>/g, '\n');

  return join_text;
}
