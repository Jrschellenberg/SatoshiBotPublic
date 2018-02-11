import {CryptopiaMiddleware, CryptopiaCurrencies} from "../src/middleware/cryptopiaMiddleware";
import {API_CREDENTIALS, CRYPTOPIA_CREDENTIALS} from "../src/service/secret";

const expect = require('chai').expect;
const cryptopiaService = require('../src/service/cryptopiaAPI')();
const cryptopiaOptions = {
	API_KEY: CRYPTOPIA_CREDENTIALS.KEY,
	API_SECRET: CRYPTOPIA_CREDENTIALS.SECRET
};
cryptopiaService.setOptions(cryptopiaOptions);

let cryptopiaCurrencies = new CryptopiaCurrencies(cryptopiaService);

let middleware = new CryptopiaMiddleware('cryptopia', cryptopiaService, cryptopiaCurrencies);

// describe('CryptopiaMiddleware - getMarketListing', () => {
// 	it('should return null if api call failed or not supplied with proper parameter', () => {
// 		expect(middleware.getMarketListing.bind(middleware, null)).to.throw(ReferenceError);
// 	});
// });

describe('CryptopiaMiddleware - checkMinimumTrades', () => {
	let markets1 = [
		{
			"quantity": 0.12971306,
			"rate": 887.77332964
		},
		{
			"quantity": 105.61429483,
			"rate": 0.80385059
		},
		{
			"quantity": 0.04750243,
			"rate": 1118.87999281
		}
	];
	let markets2 = [
		{
			"quantity": 0.00971306,
			"rate": 887.77332964
		},
		{
			"quantity": 1.61429483,
			"rate": 0.80385059
		},
		{
			"quantity": 0.00050243,
			"rate": 1118.87999281
		}
	];
	let currencies = [
		"ETH",
		"NZDT",
		"USDT"
	];
	
	it('should return true if markets have enough trade quantity to pass minimum amounts', () => {
		expect(middleware.checkMinimumTrades(markets1, currencies)).to.be.true;
	});
	it('should return false if markets do not enough trade quantity to pass minimum amounts', () => {
		expect(middleware.checkMinimumTrades(markets2, currencies)).to.be.false;
	});
});