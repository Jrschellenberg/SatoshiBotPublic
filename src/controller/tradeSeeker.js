import async from 'async';
import TradeListing from "../model/tradeListing";
import Trade from "../model/trade";

function sleep(ms = 0) {
	return new Promise(r => setTimeout(r, ms));
}

//Have Main Class as Master
//These class as slaves
//Master does trade, verifies trade went smoothly. Continues listening for events.
//May need queue to handle collisions of events.
export default class TradeSeeker {
	constructor(profitLog, errorLog, workerNumber, tradeScout,
	            utilities, production, middleWare) {
		this.utilities = utilities;
		this.middleware = middleWare;
		this.tradeScout = tradeScout;
		this.workerNumber = workerNumber;
		this.errorLog = errorLog;
		this.profitLog = profitLog;
		this.pair1 = null;
		this.pair2 = null;
		this.pair3 = null;
		this.potentialTrade = null;
		this.currencies = tradeScout.getWork(workerNumber);
		this.assignMarketPairs(this.currencies);
		this.production = production;
		this.passMinimumTrade = null;
		this.currentMarket = null;
		if (production) {
			this.process();
		}
		
	}
	
	assignMarketPairs(marketPairings) {
		this.currencies = marketPairings;
		this.pair1 = marketPairings[0] + '_' + marketPairings[2];
		this.pair2 = marketPairings[1] + '_' + marketPairings[2];
		this.pair3 = marketPairings[0] + '_' + marketPairings[1];
		
	}
	
	process() {
		//console.log("hello from satoshitrader!");
		let trader = this;
		(async () => {
			try {
				async.forever((next) => {
						//Finding new work while waiting before starting to scout for trade..
						trader.assignMarketPairs(trader.tradeScout.getWork(trader.workerNumber)); //Find more work!
						sleep(trader.middleware.API_TIMEOUT).then(() => {
							trader.currencyExchangeCalls(next);
						});
					},
					(err) => {
						console.log(err);
					}
				);
			} catch (err) {
				console.error(err);
				this.errorLog.error({pair: trader.currencies});
			}
		})();
	}
	
	logicFlow(next, oldMarkets) {
		let trader = this;
		if(trader.isProfitableTrade(oldMarkets) && trader.establishTrade(this.currentMarket)){
			console.log("trade is profitable and has been copied to log..");
			
		}
		next();
	}
	
	/*
	Function used to send out API Calls to the 3 currencies we are monitoring.
	 */
	currencyExchangeCalls(next) {
		let trader = this;
		async.series({
			one: async (callback) => {
				console.log(trader.pair1);
				const markets = await  trader.middleware.getMarketListing({market: trader.pair1, depth: 1}); // BTC_USDT
				callback(null, markets);
			},
			two: async (callback) => {
				console.log(trader.pair2);
				const markets = await  trader.middleware.getMarketListing({market: trader.pair2, depth: 1}); // BTC_USDT
				callback(null, markets);
			},
			three: async (callback) => {
				console.log(trader.pair3);
				const markets = await  trader.middleware.getMarketListing({market: trader.pair3, depth: 1});  // GRLC_BTC
				callback(null, markets);
			}
		}, (err, markets) => {
			if (err) {
				next();
			}
			trader.logicFlow(next, markets)
			//trader.isProfitableTrade(next, markets);
		})
	}
	
	isProfitableTrade(oldMarkets) {
		let trader = this;
		if (oldMarkets.one && oldMarkets.two && oldMarkets.three) { // Make sure we actually have data
			let marketOne = oldMarkets.one.buy[0],
				marketTwo = oldMarkets.two.sell[0],
				marketThree = oldMarkets.three.sell[0];
			trader.currentMarket = [marketOne, marketTwo, marketThree];
			
			try {
				let amountEarned = marketOne.rate;                       // Buying price USD
				let tradeFee = trader.utilities.precisionRound((amountEarned * trader.middleware.getMarketFee()), 8);
				amountEarned -= tradeFee; // Amount earned per 1 of each coin.
				
				let pair2Price = marketTwo.rate;                        //Selling price USD
				tradeFee = trader.utilities.precisionRound((pair2Price * trader.middleware.getMarketFee()), 8);
				pair2Price += tradeFee;
				
				let amountSpent = marketThree.rate * pair2Price;        //Selling price USD
				
				tradeFee = trader.utilities.precisionRound(amountSpent * trader.middleware.getMarketFee(), 8); //Since 2 trades, 2 times fees.
				amountSpent += tradeFee; // Add on the Fee. This is the 
				
				trader.passMinimumTrade = this.middleware.checkMinimumTrades(trader.currentMarket, this.currencies);
				
				//return (amountEarned > amountSpent) && trader.passMinimumTrade;
				return true;
				//this.establishTrade(newMarkets, passMinimumTrade);
			}
			catch (err) {
				this.errorLog.error({pair: trader.currencies});
				return false;
			}
		}
		return false;
	}
	
	establishTrade(newMarkets) {
		//console.log("inside Calculate Profits function.");
		try {
			let trader = this;
			let tradeListingOne = new TradeListing(newMarkets[0], trader.pair1, "buy");
			let tradeListingTwo = new TradeListing(newMarkets[1], trader.pair2, "sell");
			let tradeListingThree = new TradeListing(newMarkets[2], trader.pair3, "sell");
			
			trader.potentialTrade = new Trade(tradeListingOne, tradeListingTwo, tradeListingThree, trader.currencies, trader.utilities, trader.middleware);
			
			this.profitLog.info({
				information: newMarkets,
				market1: trader.pair1,
				market2: trader.pair2,
				market3: trader.pair3,
				lowestPrice: trader.potentialTrade.lowestPrice,
				trade: trader.potentialTrade,
				passMinimumTrade: trader.passMinimumTrade,
			}, `This written afterwards!!`);
			
			return true;
		}
		catch (err) {
			console.log(err);
			return false;
		}
	}
	
	verifyTrade() {
		let trader = this;
		if (trader.potentialTrade.isSufficientFunds()) {
			console.log("Account is empty or we are below minimum amount, Exiting the trade...");
			return;
		}
		console.log("Sending Trade to Master worker...");
		return;
	}
}