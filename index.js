const fetch = require('node-fetch');

module.exports.register = (options, dependencies, next) => {
  next();
};

module.exports.execute = ({ requestHeaders }) => {
  const ip = requestHeaders['x-forwarded-for'] || requestHeaders.remoteAddress;
  if (ip === undefined) {
    return new Promise(resolve => resolve({}));
  }
  const url = `https://freegeoip.net/json/${ip.split(',')[0]}`;
  return fetch(url)
    .then((response) => { // eslint-disable-line arrow-body-style
      return new Promise((resolve) => {
        response.json()
          .then((data) => {
            const copy = Object.assign(
              {},
              {
                'x-forwarded-for': requestHeaders['x-forwarded-for'],
                remoteAddress: requestHeaders.remoteAddress
              },
              data
            );
            resolve(copy);
          });
      });
    });
};
