function getName(ASN) {
  return fetch(
    'https://stat.ripe.net/data/as-names/data.json?resource=AS' + ASN
  ).then((response) => response.json());
}

function getCountry(ASN) {
  return fetch(
    'https://stat.ripe.net/data/maxmind-geo-lite-announced-by-as/data.json?resource=AS' +
      ASN
  ).then((response) => response.json());
}

function getAbuse(ASN) {
  return fetch(
    'https://stat.ripe.net/data/abuse-contact-finder/data.json?resource=AS' +
      ASN
  ).then((response) => response.json());
}

function getData(ASN) {
  return Promise.all([getName(ASN), getCountry(ASN), getAbuse(ASN)]);
}

export function fetchASNData(ASN) {
  return getData(ASN);
}
