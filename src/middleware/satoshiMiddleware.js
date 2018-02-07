import TradeMiddleware from './tradeMiddleware';

export class SatoshiMiddleware extends TradeMiddleware {
	constructor(marketFee, service, API_TIMEOUT){
		super(marketFee, service, API_TIMEOUT);
	}
	
	async getMarketListing(params){
		 const market = await this.service.getOrderBook(params);
		 return market;		
	}
	
	checkMinimumTrades(markets, currencies){
		
		
	}
	

	

	
}

export class TradeSatoshiCurrencies {
	static balance = {};
	static profit = 0;
	
	static async getAccountBalance() {
		return await TradeSatoshiCurrencies.balance;
	}
	
	static async setAccountBalance(coins) {
		for(let i=0; i<coins.length; i++){
			if(coins[i].total != 0){
				let key = coins[i].currency;
				TradeSatoshiCurrencies.balance[key] = coins[i].total;
			}
		}
	}
	static tallyProfitableTrade(amount){
		TradeSatoshiCurrencies.profit += amount;
	}
	
	static async getBalances(){
		const balance = await TradeSatoshiCurrencies.getAccountBalance();
		return balance;
	}
	
	static async setBalances(service){
		const getBalances = await service.getBalances();
		console.log("we getting back over here?");
		await TradeSatoshiCurrencies.setAccountBalance(getBalances);
	}

	
	
}