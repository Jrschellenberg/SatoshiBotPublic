import async from 'async';

function sleep(ms = 0) {
	return new Promise(r => setTimeout(r, ms));
}

export default class TradeMaster {
	constructor(successfulTradeLog, errorLog,) {
		this.successfulTradingLog = successfulTradeLog;
		this.errorLog = errorLog;
		this.currentlyTrading = false;
	}
	
	isCurrentlyTrading() {
		return this.currentlyTrading;
	}
	
	performThreeWayTrade(trade) {
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
					orders: order,
					trade: trade
				}, `Trade missed Due to inSufficient funds!!!`);
				throw new Error("Program crashed due to messing up trades PLEASE GO CHECK IMMEDIATELY"); //1 of the three trades failed :(
			}
			sleep(800).then( () => {
				if (this.isTradeComplete(order, trade)) {  //Finished updating balances, it is ok to attempt to trade again!.
					this.currentlyTrading = false;
					return true;  //The three trades successfully went through!
				}
				else {
					this.currentlyTrading = false;
					return false; //Trade is still open :(
				}
			});
			
		});
	}
	
	isTradeComplete(order, trade) {
		let times = 0;
		let isTrade1Open = true;
		let isTrade2Open = true;
		let isTrade3Open = true;
		let result = false;
		async.whilst(
			() => {
				return ((times < 10) && (isTrade1Open || isTrade2Open || isTrade3Open))
			},
			(cb) => {
				sleep(1000).then(async () => {
					const trade1 = await trade.middleware.checkOpenOrder(trade.completedTrade1.pair);
					const trade2 = await trade.middleware.checkOpenOrder(trade.completedTrade2.pair);  //.length >= 1;
					const trade3 = await trade.middleware.checkOpenOrder(trade.completedTrade3.pair); //.length >= 1;
					
					isTrade1Open = trade1.length >= 1;
					isTrade2Open = trade2.length >= 1;
					isTrade3Open = trade3.length >= 1;
					
					times++;
					cb(null, times);
				});
			},
			async (err, n) => {
				if(err){
					//throw some error here..
				}
				
				if (times === 10) {
					this.errorLog.error({
						tradeType: "Trades were submitted, BUT NEVER FINISHED CHECK NOW!!!",
						times: times,
						trade1Open: isTrade1Open,
						trade2Open: isTrade2Open,
						trade3Open: isTrade3Open,
						orders: order,
						trade: trade
					}, `Trade missed Due to inSufficient funds!!!`);
					await trade.middleware.marketBalances.setBalances();
					result = false;
					return false;
					//throw new Error("Trades were submitted, BUT NEVER FINISHED CHECK NOW!!!");
				}
				this.currentlyTrading = false;
				this.successfulTradingLog.info({
					tradeType: "Successfully executed Trade!!!!",
					trade1Open: isTrade1Open,
					trade2Open: isTrade2Open,
					trade3Open: isTrade3Open,
					orders: order,
					trade: trade
				}, `This written afterwards!!`);
				await trade.middleware.marketBalances.setBalances(); //Update our balances to reflect what is now available for us..
				result = true;
				return true;
			});
		return result;
		
	}
}
