require("babel-polyfill"); //This should go first
import {CryptopiaMiddleware, CryptopiaCurrencies} from "../src/middleware/cryptopiaMiddleware";
import {cryptopiaMarkets} from "../src/cryptopiaMarkets";
import {API_CREDENTIALS, CRYPTOPIA_CREDENTIALS} from "../src/service/secret";
import TradeSeeker from "../src/controller/tradeSeeker";
import TradeScout from "../src/controller/tradeScout";
import Utilities from '../src/utilities';
import TradeMaster from '../src/controller/tradeMaster';

const expect = require('chai').expect;
const bunyan = require('bunyan');
const NUMBER_SLAVES = 1;

const cryptopiaService = require('../src/service/cryptopiaAPI')();
const cryptopiaOptions = {
	API_KEY: CRYPTOPIA_CREDENTIALS.KEY,
	API_SECRET: CRYPTOPIA_CREDENTIALS.SECRET
};
cryptopiaService.setOptions(cryptopiaOptions);

let profitLog = bunyan.createLogger({
	name: "myapp",
	streams: [
		{
			level: 'info',
			path: './profitable.log'
		}
	]
});
let errorLog = bunyan.createLogger({
	name: "myapp",
	streams: [
		{
			level: 'error',
			path: './error.log'
		}
	]
});

let successLog = bunyan.createLogger({
	name: "myapp",
	streams: [
		{
			level: 'info',
			path: './Success.log'
		}
	]
});

const utilities = new Utilities();

let cryptopiaTradeScout = new TradeScout(NUMBER_SLAVES, cryptopiaMarkets);

let cryptopiaCurrencies = new CryptopiaCurrencies(cryptopiaService);

let balance3 = {
	ETH: {coins: 0.02750242, status: 'OK'}, NZDT: {coins: 70.0453008, status: 'OK'}, //false
	USDT: {coins: 500.56462343, status: 'OK'}
};



let middleware = new CryptopiaMiddleware('cryptopia', cryptopiaService, cryptopiaCurrencies);
let production = false;

let cryptopiaTradeMaster = new TradeMaster(successLog, errorLog);
let tradeSeeker = new TradeSeeker(profitLog, errorLog, 0, cryptopiaTradeScout, utilities,production, cryptopiaTradeMaster, middleware);

describe('TradeSeeker - Constructor', () => {
	it('should set the constructor values to the expected values', () => {
		//let currencies = cryptopiaTradeScout.getWork(0);
		expect(tradeSeeker.utilities).to.be.equal(utilities);
		expect(tradeSeeker.middleware).to.be.equal(middleware);
		expect(tradeSeeker.tradeScout).to.be.equal(cryptopiaTradeScout);
		expect(tradeSeeker.workerNumber).to.be.equal(0);
		expect(tradeSeeker.errorLog).to.be.equal(errorLog);
		expect(tradeSeeker.profitLog).to.be.equal(profitLog);
		expect(tradeSeeker.currencies).to.be.equal(cryptopiaMarkets[0]);
		expect(tradeSeeker.tradeMaster).to.be.equal(cryptopiaTradeMaster);
	});
});

describe('TradeSeeker - assignMarketPairs', () => {
	it('should set the pairs of TradeSeeker properly when called', () => {
		expect(tradeSeeker.pair1).to.be.equal(cryptopiaMarkets[0][0]+'_'+cryptopiaMarkets[0][2]);
		expect(tradeSeeker.pair2).to.be.equal(cryptopiaMarkets[0][1]+'_'+cryptopiaMarkets[0][2]);
		expect(tradeSeeker.pair3).to.be.equal(cryptopiaMarkets[0][0]+'_'+cryptopiaMarkets[0][1]);
	});
});



// describe('TradeSeeker - LogicFlow', () => {
// 	(async function () {
//		
// 		await cryptopiaCurrencies.setTestBalance(balance3);
// 		let middleware = new CryptopiaMiddleware('cryptopia', cryptopiaService, cryptopiaCurrencies);
// 	let anotherTradeSeeker = new TradeSeeker(profitLog, errorLog, 0, cryptopiaTradeScout, utilities,production, cryptopiaTradeMaster, middleware);
//	
// 	let oldMarkets = {
// 		one: {
// 			buy: [
// 				{
// 					quantity: 231.19800452,
// 					rate: 13.92580232
// 				}
// 			]
// 		},
// 		two: {
// 			sell: [
// 				{
// 					quantity: 0.02570287,
// 					rate: 8400
// 				}
// 			]
// 		},
// 		three: {
// 			sell: [
// 				{
// 					quantity: 1386.25271649,
// 					rate: 0.00162027
// 				}
// 			]
// 		}
// 	};
// 	it('should set values accordingly based off mock api data above', () => {
//		
//		
// 	});
//		
// 	})();
// });






