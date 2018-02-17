import TradeMiddleware from './tradeMiddleware';
const SATOSHI_TRADE_FEE = 0.002;
export class SatoshiMiddleware extends TradeMiddleware {
	constructor(marketListing, service, marketBalances){
		super(marketListing, SATOSHI_TRADE_FEE, service, marketBalances);
		
		/*
		IMPORTANT! MUST HAVE PARAMS BE LOWERCASE ALL LOWERCASE FOR PRIVATE FUNCTIONS!!!!!
		 */
	}
	
	async getMarketListing(params){
		let newParams = {
			market: params.market,
			depth: params.depth
		};
		const market = await this.service.getOrderBook(newParams);
		try{
			if(market.buy){
				let marketObject = {
					buy: [
						{
							quantity: market.buy[0].quantity,
							rate: market.buy[0].rate
						}
					],
					sell: [
						{
							quantity: market.sell[0].quantity,
							rate: market.sell[0].rate
						}
					]
				};
				return marketObject;
			}
			else{
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
		//const reStringMarket = this.reformatPairString(market);
		const openOrder = await this.service.getOrders({market: market, count: 1});
		return openOrder;
	}
	
	async submitOrder(params){
		//params.pair = this.reformatPairString(params.pair);
		params.trade = this.reformatTypeString(params.trade);
		try{
			const trade = await this.service.submitOrder({market: params.pair, type: params.trade, price: params.rate, amount: params.quantity});
			
			return await trade;
		}
		catch(err){
			return err;
		}
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
		
		if (super.isUSDT(currencyThree) || super.isBTC(currencyThree) || super.isLTC(currencyThree) || super.isDOGE(currencyThree) || super.isBCH(currencyThree)) {
			if (marketOneTrade > 0.00008 && marketTwoTrade > 0.00008) {
				passedChecks[0] = true;
			}
		}
		if (super.isUSDT(currencyTwo) || super.isBTC(currencyTwo) || super.isLTC(currencyTwo) || super.isDOGE(currencyTwo) || super.isBCH(currencyTwo)) {
			if (marketThreeTrade > 0.00008) {
				passedChecks[1] = true;
			}
		}
		return passedChecks[0] && passedChecks[1];
	}
	
}

let instance = null;

export class TradeSatoshiCurrencies {
	constructor(service) {
		if (instance) return instance;
		this.balance = {};
		this.service = service;
		instance = this;
	}
	
	async setAccountBalance(coins) {
		this.balance = {}; //Reset our balance to empty object once again...
		for (let i = 0; i < coins.length; i++) {
			if (coins[i].total !== 0) {
				let key = coins[i].currency;
				this.balance[key] = {
					coins: coins[i].available,
					status: 'ok' //No status on satoshi api..... le sigh
				};
			}
		}
	}
	
	getBalances() {
		return this.balance;
	}
	
	async setBalances() {
		const getBalances = await this.service.getBalances();
		console.log("we getting back over to setting balances?");
		await this.setAccountBalance(getBalances);
	}
}