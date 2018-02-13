import async from 'async';
export default class TradeMaster {
	constructor(successfulTradeLog, errorLog, ){
		this.successfulTradingLog = successfulTradeLog; 
		this.errorLog = errorLog;
		this.currentlyTrading = false;
	}
	
	isCurrentlyTrading(){
		return this.currentlyTrading;
	}
	
	performThreeWayTrade(trade){
		this.currentlyTrading = true;
		
		async.series({
			one: async (callback) => {
				//console.log(trader.pair1);
				const order = await  trade.middleware.submitOrder(trade.completedTrade1); // BTC_USDT
				callback(null, order);
			},
			two: async (callback) => {
				//console.log(trader.pair2);
				const order = await  trade.middleware.submitOrder(trade.completedTrade2); // BTC_USDT
				callback(null, order);
			},
			three: async (callback) => {
				//console.log(trader.pair3);
				const order = await trade.middleware.submitOrder(trade.completedTrade3); // BTC_USDT
				callback(null, order);
			}
		}, (err, order) => {
			if (err) {
				this.errorLog.error({
					tradeType: "Trade errored out in Perform Three way Trade!!",
					orders: order
				}, `Trade missed Due to inSufficient funds!!!`);
				return;
			}
			this.awaitCompleteTrade();
		})
	}
	
	awaitCompleteTrade(){
		
		
	}
	
	
	
	
}
