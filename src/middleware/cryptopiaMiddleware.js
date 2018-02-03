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
		const market = await this.service.getMarketOrders(newParams);
		let marketObject = {
			buy: [
				{
					quantity: market.Buy.Volume,
					rate: market.Buy.Price
				}
			],
			sell: [
				{
					quantity: market.Sell.Volume,
					rate: market.Sell.Price
				}
			]
		};
		return marketObject;
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