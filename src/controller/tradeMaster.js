import async from 'async';
export default class TradeMaster {
	constructor(successfulTradeLog, errorLog, ){
		this.potentialTrade = null;
		this.middleware = null;
		this.successfulTradingLog = successfulTradeLog; 
		this.errorLog = errorLog;
		this.currentlyTrading = false;
	}
	
	isCurrentlyTrading(){
		return this.currentlyTrading;
	}
	
	
	
	
}
