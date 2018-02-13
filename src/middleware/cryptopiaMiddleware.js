import TradeMiddleware from './tradeMiddleware';
const CRYPTOPIA_TRADE_FEE = 0.002;

export class CryptopiaMiddleware extends TradeMiddleware {
	constructor(marketListing, service, marketBalances) {
		super(marketListing, CRYPTOPIA_TRADE_FEE, service, marketBalances);
	}
	
	async getMarketListing(params) {
		let newParams = {
			Market: params.market,
			Count: params.depth
		};
		const market = await this.service.getMarketOrders(newParams);
		try {
			if (market.Buy) {
				//console.log(market);
				let marketObject = {
					buy: [
						{
							quantity: market.Buy[0].Volume,
							rate: market.Buy[0].Price
						}
					],
					sell: [
						{
							quantity: market.Sell[0].Volume,
							rate: market.Sell[0].Price
						}
					]
				};
				return marketObject;
			}
			else {
				return null;
			}
		}
		catch (err) {
			//throw new TypeError("Error in getMarketListing function!!!"+err);
			//console.log("hitting the catch here!!");
			console.log("Error in getMarketListing function!!!");
			console.log(err);
		}
	}
	
	async checkOpenOrder(market){
		const openOrder = await this.service.getOpenOrders({Market: market, Count: 1});
		return openOrder;
	}
	
	async submitOrder(params){
		params.pair = this.reformatPairString(params.pair);
		params.type = this.reformatTypeString(params.type);
		const trade = await this.service.submitTrade({Market: params.pair, Type: params.trade, Rate: params.rate, Amount: params.quantity});
		return trade;
		
	}
	reformatPairString(pair){
		return pair.replace('_', '/');
	}
	reformatTypeString(type){
		type = type.toLowerCase();
		return type.charAt(0).toUpperCase() + type.slice(1);
	}
	
	checkMinimumTrades(markets, currencies) {
		let marketOneTrade = markets[0].rate * markets[0].quantity,
			marketTwoTrade = markets[1].rate * markets[1].quantity,
			marketThreeTrade = markets[2].rate * markets[2].quantity,
			currencyTwo = currencies[1],
			currencyThree = currencies[2];
		let passedChecks = [false, false];
		
		if (super.isUSDT(currencyThree) || super.isNZDT(currencyThree)) {
			if (marketOneTrade > 1.00 && marketTwoTrade > 1.00) {
				passedChecks[0] = true;
			}
		}
		if (super.isBTC(currencyThree)) {
			if (marketOneTrade > 0.0005 && marketTwoTrade > 0.0005) {
				passedChecks[0] = true;
			}
		}
		if (super.isBTC(currencyTwo)) {
			if (marketThreeTrade > 0.0005) {
				passedChecks[1] = true;
			}
		}
		if (super.isUSDT(currencyTwo) || super.isNZDT(currencyTwo)) {
			if (marketThreeTrade > 1.00) {
				passedChecks[1] = true;
			}
		}
		return passedChecks[0] && passedChecks[1];
	}
}

let instance = null;

export class CryptopiaCurrencies {
	
	constructor(service) {
		if (instance) return instance;
		this.balance = {};
		this.service = service;
		instance = this;
	}
	
	async getAccountBalance() {
		return await this.balance;
	}
	
	async setAccountBalance(coins) {
		this.balance = {}; //Reset our balance to empty object once again...
		for (let i = 0; i < coins.length; i++) {
			if (coins[i].Total !== 0) {
				let key = coins[i].Symbol;
				this.balance[key] = {
					coins: coins[i].Total,
					status: coins[i].Status
				};
			}
		}
	}
	
	getBalances() {
		return this.balance;
	}
	
	async setBalances() {
		const getBalances = await this.service.getBalance();
		console.log("we getting back over to setting balances?");
		await this.setAccountBalance(getBalances);
	}
	
	
	async setTestBalance(balance){
		console.log("hiiii");
		this.balance = balance;
	}
	
	
}