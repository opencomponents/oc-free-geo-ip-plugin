const fetch = require('node-fetch');
const index = require('./');

jest.setMock('node-fetch', fetch);

describe('index',() => {
	
	describe('register',() => {
		test('next to have been called', () => {
			const next = jest.fn();
			index.register(null, null, next);
			expect(next).toHaveBeenCalled();
		});
	});

	describe('execute',() => {
		test('Resolving the promise should return an object', (done) => {
			fetch.mockResponse(JSON.stringify({
			  city: 'Cedar Park',
			  country_code: 'US',
			  country_name: 'United States',
			  ip: '98.6.106.250',
			  latitude: 30.4998,
			  longitude: -97.8082,
			  metro_code: 635,
			  region_code: 'TX',
			  region_name: 'Texas',
			  time_zone: 'America/Chicago',
			  zip_code: '78613',
			}));
			const context = { requestHeaders : { 'x-forwarded-for' : '98.6.106.250'}};
			index.execute(context).then(data => {
				expect(data).toMatchSnapshot();
				done();
			});
		});
	});

});
