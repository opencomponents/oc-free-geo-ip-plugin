const fetch = require('node-fetch');
const index = require('./');
const payload = require('./payload');

jest.setMock('node-fetch', fetch);

describe('index', () => {
  describe('register', () => {
    test('next to have been called', () => {
      const next = jest.fn();
      index.register(null, null, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('execute', () => {
    test('fetch response to match snapshot', (done) => {
      fetch.mockClear();
      fetch.mockResponse(JSON.stringify(payload));
      const context = { requestHeaders: { 'x-forwarded-for': '98.6.106.250' } };
      index.execute(context).then((data) => {
        expect(data).toMatchSnapshot();
        done();
      });
    });

    const scenarios = [
      {
        description: 'w/ "x-forwarded-for"',
        requestHeaders: { 'x-forwarded-for': '98.6.106.250' }
      },
      {
        description: 'w/ "remoteAddress"',
        requestHeaders: { remoteAddress: '8.8.8.8' }
      },
      {
        description: 'w/ "x-forwarded-for" w/ multiple addresses',
        requestHeaders: { 'x-forwarded-for': '127.0.0.1, 192.168.0.1, 8.8.8.8' }
      },
      {
        description: 'w/ "remoteAddress" w/ multiple addresses',
        requestHeaders: { remoteAddress: '10.0.0.10, 192.168.0.1, 8.8.8.8' }
      }
    ];

    scenarios.forEach(({ description, requestHeaders }) => {
      test(description, (done) => {
        fetch.mockClear();
        fetch.mockResponse(JSON.stringify(payload));
        const context = { requestHeaders };
        index.execute(context).then(() => {
          expect(fetch.mock.calls).toMatchSnapshot();
          done();
        });
      });
    });
  });
});
