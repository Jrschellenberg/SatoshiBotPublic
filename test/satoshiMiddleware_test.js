require("babel-polyfill"); //This should go first

import {SatoshiMiddleware, TradeSatoshiCurrencies} from "../src/middleware/satoshiMiddleware";
import {API_CREDENTIALS, CRYPTOPIA_CREDENTIALS} from "../src/service/secret";

const expect = require('chai').expect;


const tradeSatoshiService = require('../src/service/satoshiAPI')();
const tradeSatoshiOptions = {
	API_KEY: API_CREDENTIALS.KEY,
	API_SECRET: API_CREDENTIALS.SECRET
};
tradeSatoshiService.setOptions(tradeSatoshiOptions);

let satoshiCurrencies = new TradeSatoshiCurrencies(tradeSatoshiService);

let middleware = new SatoshiMiddleware('satoshi', tradeSatoshiService, satoshiCurrencies);

// describe('SatoshiMiddleware - submitOrder', () => {
// 	it('should submit the order when given valid parametesr.', async () => {
// 		let params = {
// 			"pair": "GRLC_BTC",
// 			"rate": 1,
// 			"trade": "SELL",
// 			"quantity": 3
// 		};
//
//
// 		const order = await middleware.submitOrder(params);
// 		expect(order).to.be.equal(1);
//
// 	});
// });

// describe('SatoshiMiddleware - openOrders', () => {
// 	it('should return open orders when given parameters', async () => {
// 		let param = "GRLC_BTC";
//		
// 		const openOrder = await middleware.checkOpenOrder(param);
// 		console.log(openOrder[0]);
//		
// 	});
//	
// });
