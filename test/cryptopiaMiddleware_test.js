require("babel-polyfill"); //This should go first

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

let completedTrade1 = {
	pair: 'ETH_USDT',
	rate: 887.77332964,
	trade: "SELL",
	quantity: 0.04750243
};

describe('Cryptopia Middleware - reformatPairString', () => {
	it('should replace the pairing to proper format ie replace _ with /', ()=> {
		expect(middleware.reformatPairString('BTC_USDT')).to.be.equal('BTC/USDT');
	})
});
describe('Cryptopia Middleware - reformatTypeString', () => {
	it('should return same string with only first letter capitalized', () => {
		expect(middleware.reformatTypeString('buy')).to.be.equal('Buy');
		expect(middleware.reformatTypeString('SELL')).to.be.equal('Sell');
	});
});

 /*
 Tests for private API... Uncomment these if you want to doublecheck the API's. Will have to setup everything again if using dif
 Account.
  */

// describe('Cryptopia Middleware - submitOrder',  () => {
// 	it('should return the trade data when trade is successful.', async () => {
// 		let params = {
// 			"pair": "ETN_USDT",
// 			"rate": 0.00003,
// 			"trade": "BUY",
// 			"quantity": 70000
// 		};
//
// 		const order = await middleware.submitOrder(params);
// 		expect(order).to.deep.equal(1);
// 	});
// });



// describe('Cryptopia Middleware - checkOpenOrder', () => {
//
// 	it('should throw Error if given incorrect values', async () => {
//		
// 		//let param = 355355352;
// 		let param = "ETN_USDT";
//
// 		const openOrder = await middleware.checkOpenOrder(param);
// 		let anyOrder;
// 		if(openOrder.length === 0 ){
// 			anyOrder = false
// 		}
// 		else{
// 			anyOrder = true;
// 		}
// 		console.log(openOrder[0]);
//		
//
// 		expect(openOrder).to.throw(Error);
//
// 	});
//
// });