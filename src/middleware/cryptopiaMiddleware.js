import TradeMiddleware from './tradeMiddleware';
const CRYPTOPIA_TRADE_FEE = 0.002; 
export class CryptopiaMiddleware extends TradeMiddleware {
	constructor(marketListing, service, marketBalances){
		super(marketListing, CRYPTOPIA_TRADE_FEE, service, marketBalances);
	}
	
	async getMarketListing(params){
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
			catch(err){
			console.log(err);
			}
	}
	
	checkMinimumTrades(markets, currencies ){
		let marketOneTrade = markets[0].rate * markets[0].quantity,
			marketTwoTrade = markets[1].rate * markets[1].quantity,
			marketThreeTrade = markets[2].rate * markets[2].quantity,
		currencyTwo = currencies[1],
		currencyThree = currencies[2];
		let passedChecks = [false, false];
				
		if(super.isUSDT(currencyThree) || super.isNZDT(currencyThree)){
			if(marketOneTrade > 1.00 && marketTwoTrade > 1.00){
				passedChecks[0] = true;
			}
		}
		if(super.isBTC(currencyThree)){
			if(marketOneTrade > 0.0005 && marketTwoTrade > 0.0005){
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
		return passedChecks[0] && passedChecks[1];
	}
}

let instance = null;
export class CryptopiaCurrencies {
	
	constructor(service){
		if(instance) return instance;
		this.balance = {};
		this.service = service;
		instance = this;
	}
	
	async getAccountBalance() {
		return await this.balance;
	}
	
	async setAccountBalance(coins) {
		this.balance = {}; //Reset our balance to empty object once again...
		for(let i=0; i<coins.length; i++){
			if(coins[i].Total !== 0){
				let key = coins[i].Symbol;
				this.balance[key] = {
					coins: coins[i].Total,
					status: coins[i].Status
				};
			}
		}
	}
	
	async getBalances(){
		const balance = await this.getAccountBalance();
		return balance;
	}
	
	async setBalances(){
		const getBalances = await this.service.getBalance();
		//console.log(getBalances);
		console.log("we getting back over here?");
		await this.setAccountBalance(getBalances);
	}
	
	
	
}