require("babel-polyfill"); //This should go first

let bunyan = require('bunyan');
import {CryptopiaMiddleware, CryptopiaCurrencies} from "../src/middleware/cryptopiaMiddleware";
import {cryptopiaMarkets} from "../src/cryptopiaMarkets";
import {API_CREDENTIALS, CRYPTOPIA_CREDENTIALS} from "../src/service/secret";
import TradeSeeker from "../src/controller/tradeSeeker";
import TradeScout from "../src/controller/tradeScout";
import Utilities from '../src/utilities';
import TradeMaster from '../src/controller/tradeMaster';

const expect = require('chai').expect;


let successLog = bunyan.createLogger({
	name: "myapp",
	streams: [
		{
			level: 'info',
			path: './Success.log'
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

let tradeMaster = new TradeMaster(successLog, errorLog);

describe('TradeMaster - Constructor', () => {
	it('should set constructor values correctly', () => {
		expect(tradeMaster.errorLog).to.be.equal(errorLog);
		expect(tradeMaster.successfulTradingLog).to.be.equal(successLog);
		expect(tradeMaster.currentlyTrading).to.be.false;
	});
});
describe('TradeMaster - isAvaiableForTrade', () => {
	it('should return false when masterTrader first instantiated', () => {
		let anotherTradeMaster = new TradeMaster((successLog, errorLog));
		expect(anotherTradeMaster.isCurrentlyTrading()).to.be.false;
	});
	it('should return true if currentlyTrading is set to true.', () => {
		tradeMaster.currentlyTrading = true;
		expect(tradeMaster.isCurrentlyTrading()).to.be.true;
	});
	it('should return false if currentlyTrading set to false;', () => {
		tradeMaster.currentlyTrading = false;
		expect(tradeMaster.isCurrentlyTrading()).to.be.false;
	});
});

