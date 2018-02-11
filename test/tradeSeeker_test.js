require("babel-polyfill"); //This should go first
import {CryptopiaMiddleware, CryptopiaCurrencies} from "../src/middleware/cryptopiaMiddleware";
import {cryptopiaMarkets} from "../src/cryptopiaMarkets";
import {API_CREDENTIALS, CRYPTOPIA_CREDENTIALS} from "../src/service/secret";
import TradeSeeker from "../src/controller/tradeSeeker";
import TradeScout from "../src/controller/tradeScout";
import Utilities from '../src/utilities';

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


const utilities = new Utilities();

let cryptopiaTradeScout = new TradeScout(NUMBER_SLAVES, cryptopiaMarkets);

let cryptopiaCurrencies = new CryptopiaCurrencies(cryptopiaService);

let middleware = new CryptopiaMiddleware('cryptopia', cryptopiaService, cryptopiaCurrencies);
let production = false;


let tradeSeeker = new TradeSeeker(profitLog, errorLog, 0, cryptopiaTradeScout, utilities,production, middleware);

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
	});
});

describe('TradeSeeker - assignMarketPairs', () => {
	it('should set the pairs of TradeSeeker properly when called', () => {
		expect(tradeSeeker.pair1).to.be.equal(cryptopiaMarkets[0][0]+'_'+cryptopiaMarkets[0][2]);
		expect(tradeSeeker.pair2).to.be.equal(cryptopiaMarkets[0][1]+'_'+cryptopiaMarkets[0][2]);
		expect(tradeSeeker.pair3).to.be.equal(cryptopiaMarkets[0][0]+'_'+cryptopiaMarkets[0][1]);
	});
});


