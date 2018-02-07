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
	
	checkMinimumTrades(markets, currencies ){
		console.log("Got into check Minimum.");
		let marketOneTrade = markets[0].rate * markets[0].quantity,
			marketTwoTrade = markets[1].rate * markets[1].quantity,
			marketThreeTrade = markets[2].rate * markets[2].quantity,
		currencyOne = currencies[0],
		currencyTwo = currencies[1],
		currencyThree = currencies[2];
		let passedChecks = [false, false];
		
		console.log(`currencyThree is ${currencyThree}`);
		console.log(`currencyTwo is ${currencyTwo}`);
		
		console.log(`marketOneTrade is ${marketOneTrade}`);
		console.log(`marketTwoTrade is ${marketTwoTrade}`);
		console.log(`marketThreeTrade is ${marketThreeTrade}`);
		
		if(super.isUSDT(currencyThree) || super.isNZDT(currencyThree)){
			if(marketOneTrade > 1.00 && marketTwoTrade > 1.00){
				passedChecks[0] = true;
			}
		}
		if(super.isBTC(currencyTwo)){
			if(marketThreeTrade > 0.0005){
				passedChecks[1] = true;
			}
		}
		if(super.isUSDT(currencyTwo) || super.isNZDT(currencyTwo)){
			if(marketThreeTrade > 1.00){
				passedChecks[1] = true;
			}
		}
		
		console.log(`passed checks are ${passedChecks[0]} as well as ${passedChecks[1]}`);
		
		return passedChecks[0] && passedChecks[1];
		
		
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