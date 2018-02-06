import TradeMiddleware from './tradeMiddleware';

export class CryptopiaMiddleware extends TradeMiddleware {
	constructor(marketFee, service, API_TIMEOUT){
		super(marketFee, service, API_TIMEOUT);
	}
	
	async getMarketListing(params){
		let newParams = {
			Market: params.market,
			Count: params.depth
		};
		//console.log("hitting this?");
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
				
				//console.log(marketObject);
				return marketObject;
			}
			else {
				return null;
			}
		}
			catch(err){
			console.log(err);
			}
	}
	
}

export class CryptopiaCurrencies {
	static balance = {};
	static profit = 0;
	
	static async getAccountBalance() {
		return await CryptopiaCurrencies.balance;
	}
	
	static async setAccountBalance(coins) {
		for(let i=0; i<coins.length; i++){
			if(coins[i].total != 0){
				let key = coins[i].currency;
				CryptopiaCurrencies.balance[key] = coins[i].total;
			}
		}
	}
	static tallyProfitableTrade(amount){
		CryptopiaCurrencies.profit += amount;
	}
	
	static async getBalances(){
		const balance = await CryptopiaCurrencies.getAccountBalance();
		return balance;
	}
	
	static async setBalances(service){
		const getBalances = await service.getBalances();
		console.log("we getting back over here?");
		await CryptopiaCurrencies.setAccountBalance(getBalances);
	}
	
	
	
}