import async from 'async';

import TradeSatoshiCurrencies from "../middleware/satoshiMiddleware";
import TradeListing from "../model/tradeListing";
import Trade from "../model/trade";

function sleep(ms = 0) {
	return new Promise(r => setTimeout(r, ms));
}

//Have Main Class as Master
//These class as slaves
//Master does trade, verifies trade went smoothly. Continues listening for events.
//May need queue to handle collisions of events.
export default class TradeSeeker{
	constructor(profitLog, errorLog, workerNumber, tradeScout,
	            middleWare){
		this.middleware = middleWare;
		this.tradeScout = tradeScout;
		this.workerNumber = workerNumber;
		this.errorLog = errorLog;
		this.profitLog = profitLog;
		this.pair1 = null;
		this.pair2 = null;
		this.pair3 = null;
		this.pair4 = null;
		this.potentialTrade = null;
		this.currencies = tradeScout.getWork(workerNumber);
		this.assignMarketPairs(this.currencies);
		this.process();
	}
	
	assignMarketPairs(marketPairings){
		this.pair1 = marketPairings[0]+'_USDT';
		this.pair2 = marketPairings[1]+'_USDT';
		this.pair3 = marketPairings[2]+'_'+marketPairings[1];
		this.pair4 = marketPairings[2]+'_'+marketPairings[0];
	}
	
	process(){
		//console.log("hello from satoshitrader!");
		let trader = this;
		(async () => {
			try {
				async.forever((next)=>
					{
						//Finding new work while waiting before starting to scout for trade..
						trader.assignMarketPairs(trader.tradeScout.getWork(trader.workerNumber)); //Find more work!
						sleep(trader.middleware.API_TIMEOUT).then(()=>{
							trader.currencyExchangeCalls(next);
						});
					},
					(err) =>{
						console.log(err);
						console.log("Error BUBBLING UP HERE");
					}
				);
			} catch (err) {
				console.error(err);
				this.errorLog.error({pair: trader.currencies});
			}
		})();
	}
	
	
	/*
	Function used to send out API Calls to the 3 currencies we are monitoring.
	 */
	currencyExchangeCalls(next){
		let trader = this;
		async.series({
			one: async (callback) => {
				const markets = await	trader.middleware.getMarketListing({market: trader.pair1, depth: 1}); // BTC_USDT
				callback(null, markets);
			},
			two: async (callback) =>{
					const markets = await	trader.middleware.getMarketListing({market: trader.pair2, depth: 1}); // BTC_USDT
					callback(null, markets);
			},
			three: async  (callback) =>{
				const markets = await	trader.middleware.getMarketListing({market: trader.pair3, depth: 1});  // GRLC_BTC
				callback(null, markets);
			},
			four: async  (callback) =>{
				const markets = await	trader.middleware.getMarketListing({market: trader.pair4, depth: 1});  //GRLC_LTC
				callback(null, markets);
			},
		}, (err, markets) => {
			trader.isProfitableTrade(next, markets);
		})
	}
	
	isProfitableTrade(next, markets){
		let trader = this;
		if(markets){ // Make sure we actually have data
			let marketOne = markets.one.buy[0],
				marketTwo = markets.two.sell[0],
				marketThree = markets.three.sell[0],
				marketFour = markets.four.buy[0];
			
			try{
				let pair1Price = marketOne.rate;                       // Buying price USD
				let amountEarned = marketFour.rate * pair1Price;        //Buying price USD
				let pair2Price = marketTwo.rate;                        //Selling price USD
				let amountSpent = marketThree.rate * pair2Price;        //Selling price USD
				let tradeFee = amountSpent * trader.middleware.getMarketFee();
				amountSpent += tradeFee;
				tradeFee = amountEarned * trader.middleware.getMarketFee();
				amountEarned -=  tradeFee;
				
				
				/*
				Satoshi API is retarded, need to add a check to do a trade in reverse if it doesn't go through >.> sigh
				 */
				console.log(`Amount spent is ${amountSpent}`);
				console.log(`Amount Earned is ${amountEarned}`);
				
				if(amountEarned > amountSpent){ //Is a profitable trade...
					let profit = amountEarned - amountSpent;
					console.log("This trade is profitable");
					this.calculateProfits(markets, profit);
				}
				else{
					// if(amountEarned <0){
					// 	console.log("BELOW 0!");
					// 	this.profitLog.info({information: markets, market1: satoshiTrader.pair1,
					// 		market2: satoshiTrader.pair2, market3: satoshiTrader.pair3, market4: satoshiTrader.pair4}, `We Found a profitable Trade! Yay!`);
					// }
					console.log('nothing, lets try again!');
				//	console.log("This trade is not profitable");
				}
			}
			catch(err){
				//console.log(err);
				this.errorLog.error({pair: trader.currencies});
			}
		}
		next(); //Use this to restart the loop..
	}
	
	calculateProfits(markets, profit){
		let trader = this;
		let tradeListingOne = new TradeListing(markets.one.buy[0], trader.pair1, "buy");
		let tradeListingTwo = new TradeListing(markets.two.sell[0], trader.pair2, "sell");
		let tradeListingThree = new TradeListing(markets.three.sell[0], trader.pair3, "sell");
		let tradeListingFour = new TradeListing(markets.four.buy[0], trader.pair4, "buy");
		
		trader.potentialTrade = new Trade(tradeListingOne, tradeListingTwo, tradeListingThree, tradeListingFour, trader.middleware);
		trader.potentialTrade.updateQuantities().then(() => {
		TradeSatoshiCurrencies.tallyProfitableTrade(trader.potentialTrade.lowestPrice * profit);
			
		this.profitLog.info({information: markets, market1: trader.pair1,
			market2: trader.pair2, market3: trader.pair3, market4: trader.pair4, profit: profit, lowestPrice: trader.potentialTrade.lowestPrice, totalProfit:
			TradeSatoshiCurrencies.profit, trade: trader.potentialTrade}, `We Found a profitable Trade! Yay!`);
			
			this.verifyTrade();
		}); //Updates the quantities to correct ones.
		
	}
	verifyTrade(){
		let trader = this;
		if(trader.potentialTrade.isAccountEmpty() || trader.potentialTrade.isBelowMinimum()){
			console.log("Account is empty or we are below minimum amount, Exiting the trade...");
			return;
		}
		console.log("Sending Trade to Master worker...");
	}
}