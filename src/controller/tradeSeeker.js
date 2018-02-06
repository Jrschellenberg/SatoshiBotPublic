import async from 'async';

import CryptopiaCurrencies from "../middleware/cryptopiaMiddleware";
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
		this.potentialTrade = null;
		this.currencies = tradeScout.getWork(workerNumber);
		this.assignMarketPairs(this.currencies);
		this.process();
	}
	
	assignMarketPairs(marketPairings){
		this.pair1 = marketPairings[0]+'_'+marketPairings[2];
		this.pair2 = marketPairings[1]+'_'+marketPairings[2];
		this.pair3 = marketPairings[0]+'_'+marketPairings[1];

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
			// four: async  (callback) =>{
			// 	const markets = await	trader.middleware.getMarketListing({market: trader.pair4, depth: 1});  //GRLC_LTC
			// 	callback(null, markets);
			// },
		}, (err, markets) => {
			if(err){
				next();
			}
			trader.isProfitableTrade(next, markets);
		})
	}
	
	isProfitableTrade(next, markets){
		let trader = this;
		if(markets.one && markets.two && markets.three){ // Make sure we actually have data
			let marketOne = markets.one.buy[0],
				marketTwo = markets.two.sell[0],
				marketThree = markets.three.sell[0];
				//marketFour = markets.four.buy[0];
			
			try{
				
				
				let amountEarned = marketOne.rate;                       // Buying price USD
				let tradeFee = this.precisionRound((amountEarned * trader.middleware.getMarketFee()), 8);
				amountEarned -=  tradeFee; // Amount earned per 1 of each coin.
				
				let pair2Price = marketTwo.rate;                        //Selling price USD
				tradeFee = this.precisionRound((pair2Price*trader.middleware.getMarketFee()), 8);
				pair2Price += tradeFee;
				
				let amountSpent = marketThree.rate * pair2Price;        //Selling price USD
				
				tradeFee = this.precisionRound(amountSpent *trader.middleware.getMarketFee(),8); //Since 2 trades, 2 times fees.
				amountSpent += tradeFee; // Add on the Fee. This is the 
				
				
				
				/*
				Satoshi API is retarded, need to add a check to do a trade in reverse if it doesn't go through >.> sigh
				 */
				console.log(`Amount spent is ${amountSpent}`);
				console.log(`Amount Earned is ${amountEarned}`);
				//console.log(this.pair1+this.pair2+this.pair3+this.pair4);
				
				if(amountEarned > amountSpent){ //Is a profitable trade...
					let profit = amountEarned - amountSpent;
					console.log("This trade is profitable");
					console.log(`Profit earned is ${profit}`);
					//this.calculateProfits(markets, profit);
					this.profitLog.info({
						information: markets,
						market1: trader.pair1,
						market2: trader.pair2,
						market3: trader.pair3,
//				market4: trader.pair4,
						profit: profit,
						//profitFromTrade: profitTrade,
					//	lowestPrice: trader.potentialTrade.lowestPrice,
					//	trade: trader.potentialTrade
					}, `We Found a profitable Trade! Yay!`);
					
					
					
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
		console.log("inside Calculate Profits function.");
		try {
			let trader = this;
			let tradeListingOne = new TradeListing(markets.one.buy[0], trader.pair1, "buy");
			let tradeListingTwo = new TradeListing(markets.two.sell[0], trader.pair2, "sell");
			let tradeListingThree = new TradeListing(markets.three.sell[0], trader.pair3, "sell");
//			let tradeListingFour = new TradeListing(markets.four.buy[0], trader.pair4, "buy");
			
			trader.potentialTrade = new Trade(tradeListingOne, tradeListingTwo, tradeListingThree, tradeListingFour, trader.middleware);
			console.log("ARe we getting TO HERE??!");
			
			let profitTrade = trader.potentialTrade.lowestPrice * profit; // ?? this is questionable..
			
			console.log("getting here? on profit trade?");
			
			this.profitLog.info({
				information: markets,
				market1: trader.pair1,
				market2: trader.pair2,
				market3: trader.pair3,
//				market4: trader.pair4,
				profit: profit,
				profitFromTrade: profitTrade,
				lowestPrice: trader.potentialTrade.lowestPrice,
				trade: trader.potentialTrade
			}, `We Found a profitable Trade! Yay!`);
			
			this.verifyTrade();
		}
		catch(err){
			console.log(err);
		}
		
	}
	verifyTrade(){
		let trader = this;
		if(trader.potentialTrade.isAccountEmpty() || trader.potentialTrade.isBelowMinimum()){
			console.log("Account is empty or we are below minimum amount, Exiting the trade...");
			return;
		}
		console.log("Sending Trade to Master worker...");
	}
	
	precisionRound(num, precision){
		let factor = Math.pow(10, precision);
		return Math.round(num * factor)/factor;
	}
	
	
}