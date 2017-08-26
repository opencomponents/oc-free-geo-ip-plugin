const fetch = require('node-fetch');

module.exports.register = (options, dependencies, next) => {
  next();
};

module.exports.execute = (context) => {
  const ip = context.requestHeaders['x-forwarded-for'] || context.requestHeaders.remoteAddress;
  if (ip === undefined) {
    return new Promise(resolve => resolve({}));
  }
  const url = `https://freegeoip.net/json/${ip.split(',')[0]}`;
  return fetch(url).then((response) => { // eslint-disable-line arrow-body-style
    return new Promise((resolve) => {
      response.json()
        .then((data) => {
          const copy = Object.assign(
            {},
            {
              'x-forwarded-for': context.requestHeaders['x-forwarded-for'],
              remoteAddress: context.requestHeaders.remoteAddress
            },
            data
          );
          resolve(copy);
        });
    });
  });
};
