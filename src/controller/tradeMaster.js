import async from 'async';
export default class TradeMaster {
	constructor(middleware, successfulTradeLog, errorLog, ){
		this.tradeToExecute = null;
		this.middleware = middleware;
		this.successfulTradingLog = successfulTradeLog; 
		this.errorLog = errorLog;
		this.isCurrentlyTrading = false;
		
	}
	
	isAvailableForTrade(){
		return this.isCurrentlyTrading;
	}
	
	
}
