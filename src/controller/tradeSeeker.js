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
		this.currencies = marketPairings;
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
			let newMarkets = [marketOne, marketTwo, marketThree];
			
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
				
				// if(amountEarned > amountSpent){ //Is a profitable trade... // Or i can throw it up here
					//let profit = amountEarned - amountSpent;
					
					console.log("This trade is profitable");
					let passMinimumTrade = this.middleware.checkMinimumTrades(newMarkets, this.currencies);
					
					this.calculateProfits(newMarkets, passMinimumTrade);
					this.profitLog.info({
						information: markets,
						market1: trader.pair1,
						market2: trader.pair2,
						market3: trader.pair3,
//				market4: trader.pair4,
						passMinimums: passMinimumTrade,
						//profitFromTrade: profitTrade,
					//	lowestPrice: trader.potentialTrade.lowestPrice,
					//	trade: trader.potentialTrade
					}, `We Found a profitable Trade! Yay!`);
					
				// }
				// else{
				// 	console.log('nothing, lets try again!');
				// }
			}
			catch(err){
				this.errorLog.error({pair: trader.currencies});
			}
		}
		next(); //Use this to restart the loop..
	}
	
	calculateProfits(markets, passMinimumTrade){
		console.log("inside Calculate Profits function.");
		try {
			let trader = this;
			let tradeListingOne = new TradeListing(markets[0], trader.pair1, "buy");
			let tradeListingTwo = new TradeListing(markets[1], trader.pair2, "sell");
			let tradeListingThree = new TradeListing(markets[2], trader.pair3, "sell");
			
			trader.potentialTrade = new Trade(tradeListingOne, tradeListingTwo, tradeListingThree, trader.currencies,trader.middleware);
			console.log("ARe we getting TO HERE??!");
			
			//let profitTrade = trader.potentialTrade.lowestPrice * profit; // ?? this is questionable..
			
			console.log("getting here? on profit trade?");
			
			this.profitLog.info({
				information: markets,
				market1: trader.pair1,
				market2: trader.pair2,
				market3: trader.pair3,
				lowestPrice: trader.potentialTrade.lowestPrice,
				trade: trader.potentialTrade,
				passMinimums: passMinimumTrade,
			}, `This written afterwards!!`);
			
			//this.verifyTrade();
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