import Trade from "../src/model/trade";
import TradeListing from "../src/model/tradeListing";
import Utilities from "../src/utilities";
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


let utilities = new Utilities();
let middleware = new CryptopiaMiddleware('cryptopia', cryptopiaService, cryptopiaCurrencies);
let currencies = ['ETH', 'NZDT', 'USDT'];

let market1 = {
	quantity: 0.12971306,
	rate: 887.77332964
};
let market2 = {
	quantity: 105.61429483,
	rate: 0.80385059
};
let market3 = {
	quantity: 0.04750243,
	rate: 1118.87999281
};

let tradeListing1 = new TradeListing(market1, "ETH_USDT", 'buy');
let tradeListing2 = new TradeListing(market2, "NZDT_USDT", 'sell');
let tradeListing3 = new TradeListing(market3, "ETH_NZDT", 'sell');

let trade = new Trade(tradeListing1, tradeListing2, tradeListing3, currencies, utilities, middleware);

describe('Trade - Constructor', () => {
	it('should set values to expected values', () => {
		expect(trade.completedTrade1.rate).to.be.equal(887.77332964 - 0.00000002);
		expect(trade.completedTrade1.trade).to.be.equal('SELL');
		expect(trade.completedTrade1.quantity).to.be.equal(0.04750243);
		
		expect(trade.completedTrade2.rate).to.be.equal(0.80385059 + 0.00000002);
		expect(trade.completedTrade2.trade).to.be.equal('BUY');
		expect(trade.completedTrade2.quantity).to.be.equal(53.25581758);
		
		expect(trade.completedTrade3.rate).to.be.equal(1118.87999281 + 0.00000002);
		expect(trade.completedTrade3.trade).to.be.equal('BUY');
		expect(trade.completedTrade3.quantity).to.be.equal(0.04750243);
		
		expect(trade.trade1).to.be.equal(tradeListing1.tradeListing);
		expect(trade.trade2).to.be.equal(tradeListing2.tradeListing);
		expect(trade.trade3).to.be.equal(tradeListing3.tradeListing);
		
		expect(trade.trade1.usdRateOrder).to.be.equal(trade.trade1.quantity * trade.trade1.rate);
		expect(trade.trade2.usdRateOrder).to.be.equal(trade.trade2.quantity * trade.trade2.rate);
		expect(trade.trade3.usdRateOrder).to.be.equal(trade.trade3.quantity * trade.trade3.rate * trade.trade2.rate);
		
		expect(trade.lowestPrice).to.be.equal(42.724271834068865);
		
		expect(trade.trade1.limitingReagent).to.be.false;
		expect(trade.trade2.limitingReagent).to.be.false;
		expect(trade.trade3.limitingReagent).to.be.true;
		
		expect(trade.currencies).to.be.equal(currencies);
		expect(trade.middleware).to.be.equal(middleware);
		expect(trade.utilities).to.be.equal(utilities);
		
		expect(trade.profit).to.be.equal(-0.80812232);
	});
});

describe('Trade - calculateProfitEarned', () => {
	it('should properly calculate profit when supplied with proper input', () => {
		expect(trade.calculateProfitEarned(trade.completedTrade1.rate, trade.completedTrade1.quantity, trade.middleware.marketFee))
			.to.be.equal(42.08704766524869);
		
		let trade1Rate = 0.00000085;
		let trade1Quantity = 1100;
		let marketFee = 0.002;
		expect(trade.calculateProfitEarned(trade1Rate, trade1Quantity, marketFee)).to.be.equal(0.0009331300000000001);
		
	});
});

describe('Trade - calculateAmountSpent', () => {
	it('should properly calculate amount spent when supplied with proper input', () => {
		expect(trade.calculateAmountSpent(trade.completedTrade3.quantity, trade.completedTrade3.rate,
			trade.completedTrade2.rate, trade.middleware.marketFee))
			.to.be.equal(42.89516998941422);
		
		
		let trade2Rate = 0.00000072;
		let trade3Rate = 1.10000012;
		let trade3Quantity = 1100;
		let marketFee = 0.002;
		
		
		expect(trade.calculateAmountSpent(trade3Quantity, trade3Rate, trade2Rate, marketFee)).to.be.equal(0.0008746848954201601);
	});
});

describe('Trade - calculateProfit', () => {
	it('should properly calculate profit and in which currency when supplied with correct input', () => {
		expect(trade.calculateProfit()).to.be.equal(-0.80812232);
	});
	
	it('should still work when given a different set of completed trades.', () => {
		
		let newMarket1 = {
			"quantity": 17878.23204164,
			"rate": 8.7e-7
		};
		let	newMarket2 = {
			"quantity": 190363.54720677,
			"rate": 7.0e-7
		};
		let newMarket3= {
			"quantity": 1100,
			"rate": 1.1000001
		};
		
		let newTradeListing1 = new TradeListing(newMarket1, "BTCZ_BTC", 'buy');
		let newTradeListing2 = new TradeListing(newMarket2, "DOGE_BTC", 'sell');
		let newTradeListing3 = new TradeListing(newMarket3, "BTCZ_DOGE", 'sell');
		let newCurrencies = [
			"BTCZ",
			"DOGE",
			"BTC"
		];
		
		
		
		let newTrade = new Trade(newTradeListing1, newTradeListing2, newTradeListing3, currencies, utilities, middleware);
		
		
		expect(newTrade.calculateProfit()).to.be.equal(0.00005845);
		
	});
	
});

describe('Trade - ComputeTrade', () => {
	it('should properly calculate the quantity required for trade given correct input', () => {
		expect(trade.computeTrade(trade.completedTrade3.quantity, trade.trade3.rate, trade.middleware.marketFee, 'buy'))
			.to.be.equal(53.25581757685753);
		expect(trade.computeTrade(trade.completedTrade3.quantity, trade.trade3.rate, trade.middleware.marketFee, 'BUY'))
			.to.be.equal(53.25581757685753);
		expect(trade.computeTrade(trade.completedTrade3.quantity, trade.trade3.rate, trade.middleware.marketFee, 'sell'))
			.to.be.equal(53.043219496857525);
		expect(trade.computeTrade(trade.completedTrade3.quantity, trade.trade3.rate, trade.middleware.marketFee, 'SELL'))
			.to.be.equal(53.043219496857525);
	});
});
describe('Trade - determineEnoughFundsThreeTrades', () => {
	let balance1 = {
		ETH: {coins: 0.053008, status: 'OK'}, //false
		USDT: {coins: 15.56462343, status: 'OK'}
	};
	let balance2 = {
		NZDT: {coins: 12.0453008, status: 'OK'}, //False
		USDT: {coins: 15.56462343, status: 'OK'}
	};
	let balance3 = {
		ETH: {coins: 0.04750242, status: 'OK'}, NZDT: {coins: 70.0453008, status: 'OK'}, //false
		USDT: {coins: 500.56462343, status: 'OK'}
	};
	let balance4 = {
		ETH: {coins: 0.04850243, status: 'OK'}, NZDT: {coins: 53.35581758, status: 'OK'}, //True
		USDT: {coins: 42.99533983, status: 'OK'}
	};
	let balance5 = {
		ETH: {coins: 2.04750243, status: 'OK'}, NZDT: {coins: 533.25581758, status: 'OK'}, //True
		USDT: {coins: 422.89533983, status: 'OK'}
	}; //True
	
	it('should return false if user does not have sufficient funds', () => {
		expect(trade.determineEnoughFundsThreeTrades(balance1)).to.be.false;
		expect(trade.determineEnoughFundsThreeTrades(balance2)).to.be.false;
		expect(trade.determineEnoughFundsThreeTrades(balance3)).to.be.false;
	});
	it('should throw error if given null', () => {
		expect(trade.determineEnoughFundsThreeTrades.bind(trade, null))
			.to.throw(TypeError);
	});
	it('should return true if user has sufficient funds', () => {
		expect(trade.determineEnoughFundsThreeTrades(balance4)).to.be.true;
		expect(trade.determineEnoughFundsThreeTrades(balance5)).to.be.true;
	});
});

describe('Trade - ExecuteTrade', () => {
	let newTrade = new Trade(tradeListing1, tradeListing2, tradeListing3, currencies, utilities, middleware);
	it('Should maintain proper ratios on trades during constructor..', () => {
		expect(newTrade.completedTrade1.quantity).to.be.equal(0.04750243);
		expect(newTrade.completedTrade2.quantity).to.be.equal(53.25581758);
		expect(newTrade.completedTrade3.quantity).to.be.equal(0.04750243);
	});
	
	it('should be able to shift all of the quantities to lower trade when given a ratio less than 1', () => {
		newTrade.executeTrade(0.57896);
		expect(newTrade.completedTrade1.quantity).to.be.equal(0.02750201);
		expect(newTrade.completedTrade2.quantity).to.be.equal(30.83299165);
		expect(newTrade.completedTrade3.quantity).to.be.equal(0.02750201);
	});
});

describe('Trade - determineEnoughFundsTwoTrades', () => {
	let balance1 = {
		ETN: {coins: 0.40453008, status: 'OK'},
		USDT: {coins: 15.56462343, status: 'OK'}
	};
	let balance2 = {
		NZDT: {coins: 12.0453008, status: 'OK'},
		USDT: {coins: 15.56462343, status: 'OK'}
	};
	let balance3 = {
		NZDT: {coins: 70.0453008, status: 'OK'},
		USDT: {coins: 50.56462343, status: 'OK'}
	};
	let balance4 = {
		NZDT: {coins: 70.1453008, status: 'OK'},
		USDT: {coins: 42.99533983, status: 'OK'}
	};
	
	it('should return false if user does not have sufficient funds', () => {
		expect(trade.determineEnoughFundsTwoTrades(balance1)).to.be.false;
		expect(trade.determineEnoughFundsTwoTrades(balance2)).to.be.false;
	});
	it('should throw error if given null', () => {
		expect(trade.determineEnoughFundsTwoTrades.bind(trade, null))
			.to.throw(TypeError);
	});
	it('should return true if user has sufficient funds', () => {
		expect(trade.determineEnoughFundsTwoTrades(balance3)).to.be.true;
		expect(trade.determineEnoughFundsTwoTrades(balance4)).to.be.true;
	});
});
describe('Trade - isProfitable', () => {
	it('should return false if profit is less than or equal to 0', () => {
		expect(trade.isProfitable()).to.be.false;
		trade.profit = 0;
		expect(trade.isProfitable()).to.be.false;
	});
	it('should return true if profit is greater than 0', () => {
		trade.profit = 0.30;
		expect(trade.isProfitable()).to.be.true;
	});
});

describe('Trade - determineLeastFundsAvailable', () => {
	it('should return the lowest ratio of funds available', () => {
		let balance3 = {
			ETH: {coins: 0.02750242, status: 'OK'}, NZDT: {coins: 70.0453008, status: 'OK'}, //false
			USDT: {coins: 500.56462343, status: 'OK'}
		};
		let objExpecting = {
			currency: 'ETH',
			lowest: 0.57896
		};
		expect(trade.determineLeastFundsAvailable(balance3)).to.deep.equal(objExpecting);
	});
	
	it('should determine Lowest ratio for only 2 of 3 funds as well', () => {
		let balance3 = {
			NZDT: {coins: 20.0453008, status: 'OK'}, //false
			USDT: {coins: 500.56462343, status: 'OK'}
		};
		let objExpecting = {
			currency: 'NZDT',
			lowest: 0.37639
		};
		expect(trade.determineLeastFundsAvailable(balance3)).to.deep.equal(objExpecting);
	});
	it('should throw an error if no balance is provided', () => {
		expect(trade.determineLeastFundsAvailable.bind(trade, null)).to.throw(TypeError)
	});
	it('should return a lowest of 1 and the first currency if none of the balances required are available', () => {
		let balance3 = {
			BTC: {coins: 20.0453008, status: 'OK'}, //false
			LUX: {coins: 500.56462343, status: 'OK'}
		};
		let objExpecting = {
			currency: 'ETH',
			lowest: 1
		};
		expect(trade.determineLeastFundsAvailable(balance3)).to.deep.equal(objExpecting);
	});
});


describe('Trade - isAllStatusOk', () => {
	let balance = { BTC: { coins: 0.00573668, status: 'OK' },
		ETH: { coins: 0.79861009, status: 'Maintenance' },
		XMR: { coins: 0.02, status: 'Maintenance' },
		NZDT: { coins: 64.68536503, status: 'OK' },
		USDT: { coins: 43.41650288, status: 'OK' } };
	
	let balance8 = { BTC: { coins: 0.00573668, status: 'OK' },
		XMR: { coins: 0.02, status: 'Maintenance' },
		NZDT: { coins: 64.68536503, status: 'OK' },
		USDT: { coins: 43.41650288, status: 'Maintenance' } };
	
	//let currencies = ["BTC", "XMR", "USDT"];
	let balance4 = { BTC: { coins: 0.00573668, status: 'OK' },
		XMR: { coins: 0.02, status: 'Maintenance' },
		NZDT: { coins: 64.68536503, status: 'OK' },
		USDT: { coins: 43.41650288, status: 'Ok' } };
	
	let balance2 = { BTC: { coins: 0.00573668, status: 'OK' },
		ETH: { coins: 0.79861009, status: 'oK' },
		XMR: { coins: 0.02, status: 'Maintenance' },
		NZDT: { coins: 64.68536503, status: 'Ok' },
		USDT: { coins: 43.41650288, status: 'ok' } };
	
	it('should return false if any status is not ok.', () => {
		expect(trade.isAllStatusOk(balance)).to.be.false;
		expect(trade.isAllStatusOk(balance8)).to.be.false;
	});
	
	it('should return true if all status are ok', () => {
		expect(trade.isAllStatusOk(balance4)).to.be.true;
		expect(trade.isAllStatusOk(balance2)).to.be.true;
		
	});
});