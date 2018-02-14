require("babel-polyfill"); //This should go first

let bunyan = require('bunyan');
import {CryptopiaMiddleware, CryptopiaCurrencies} from "../src/middleware/cryptopiaMiddleware";
import {cryptopiaMarkets} from "../src/cryptopiaMarkets";
import {API_CREDENTIALS, CRYPTOPIA_CREDENTIALS} from "../src/service/secret";
import TradeSeeker from "../src/controller/tradeSeeker";
import TradeScout from "../src/controller/tradeScout";
import Utilities from '../src/utilities';
import TradeMaster from '../src/controller/tradeMaster';

import Trade from "../src/model/trade";

const expect = require('chai').expect;


const cryptopiaService = require('../src/service/cryptopiaAPI')();
const cryptopiaOptions = {
	API_KEY: CRYPTOPIA_CREDENTIALS.KEY,
	API_SECRET: CRYPTOPIA_CREDENTIALS.SECRET
};
cryptopiaService.setOptions(cryptopiaOptions);


const utilities = new Utilities();

//let cryptopiaTradeScout = new TradeScout(NUMBER_SLAVES, cryptopiaMarkets);

let cryptopiaCurrencies = new CryptopiaCurrencies(cryptopiaService);


let middleware = new CryptopiaMiddleware('cryptopia', cryptopiaService, cryptopiaCurrencies);


let tradeListing1 = {
	tradeListing: {
		pair: "ETN_USDT",
		type: "buy",
		quantity: 18104.51082394,
		rate: 0.06919996,
		usdRateOrder: 1252.8314248362,
		limitingReagent: false
	}
};
let tradeListing2 = {
	tradeListing: {
		pair: "BTC_USDT",
		type: "sell",
		quantity: 0.11686123,
		rate: 8644.99899998,
		usdRateOrder: 1010.2652164864,
		limitingReagent: true
	}
};

let tradeListing3 = {
	tradeListing: {
		pair: "ETN_BTC",
		type: "sell",
		quantity: 37125.97201816,
		rate: 7.95e-6,
		usdRateOrder: 2551.5842282137,
		limitingReagent: false
	}
};

let trade = new Trade(tradeListing1, tradeListing2, tradeListing3, ["ETN", "BTC", "USDT"], utilities, middleware);


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

let tradeInformation = {
	completedTrade1: {
		pair: "BTC_USDT",
		rate: 18000,
		trade: "SELL",
		quantity: 0.001
	},
	completedTrade2: {
		pair: "NZDT_USDT",
		rate: 0.08,
		trade: "BUY",
		quantity: 15
	},
	completedTrade3: {
		pair: "BTC_NZDT",
		rate: 100.001,
		trade: "BUY",
		quantity: 0.02
	},
	trade1: {
		pair: "ETN_USDT",
		type: "buy",
		quantity: 18104.51082394,
		rate: 0.06919996,
		usdRateOrder: 1252.8314248362,
		limitingReagent: false
	},
	trade2: {
		pair: "BTC_USDT",
		type: "sell",
		quantity: 0.11686123,
		rate: 8644.99899998,
		usdRateOrder: 1010.2652164864,
		limitingReagent: true
	},
	trade3: {
		pair: "ETN_BTC",
		type: "sell",
		quantity: 37125.97201816,
		rate: 7.95e-6,
		usdRateOrder: 2551.5842282137,
		limitingReagent: false
	},
	lowestPrice: 1010.2652164864,
	currencies: [
		"BTC",
		"NZDT",
		"USDT"
	],
	middleware: {
		marketListing: "cryptopia",
		API_TIMEOUT: 800,
		marketFee: 0.002,
		marketBalances: {
			balance: {
				BTC: {
					coins: 0.00573668,
					status: "OK"
				},
				LTC: {
					coins: 0.31861009,
					status: "OK"
				},
				NZDT: {
					coins: 64.68536503,
					status: "OK"
				},
				USDT: {
					coins: 48.30936668,
					status: "OK"
				}
			},
			service: {}
		},
		service: {}
	},
	utilities: {},
	profit: 0.04123444,
	displayProfit: "0.04123444USDT"
};

trade.completedTrade1 = {
	pair: "BTC_USDT",
	rate: 18000,
	trade: "SELL",
	quantity: 0.001
};

trade.completedTrade2 = {
	pair: "NZDT_USDT",
	rate: 0.08,
	trade: "BUY",
	quantity: 15
};
trade.completedTrade3 = {
	pair: "BTC_NZDT",
	rate: 100.001,
	trade: "BUY",
	quantity: 0.02
};

describe('Trademaster - isTradeComplete', () => {

	it('should have values set up properly', () => {
		expect(trade.completedTrade1).to.deep.equal(tradeInformation.completedTrade1);
		expect(trade.completedTrade2).to.deep.equal(tradeInformation.completedTrade2);
		expect(trade.completedTrade3).to.deep.equal(tradeInformation.completedTrade3);

	});

	it('should return  while there are no open trades', () => {
		let order = {};
		expect(tradeMaster.isTradeComplete(order, trade)).to.be.true;
	});




});

