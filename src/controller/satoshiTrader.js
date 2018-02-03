import async from 'async';
import {API_CREDENTIALS} from "../service/secret";
import TradeSatoshiCurrencies from "../model/tradeSatoshiAccountBalance";
import SatoshiTradeScout from "./SatoshiTradeScout";
import TradeListing from "../model/tradeListing";
import Trade from "../model/trade";

const TradeSatoshi = require('../service/satoshiAPI')();
const TradeSatoshiFeePrice = 0.002;
const API_TIMEOUT = 800;

//Setting up Service
const options = {
	API_KEY: API_CREDENTIALS.KEY,
	API_SECRET: API_CREDENTIALS.SECRET
};
TradeSatoshi.setOptions(options);

function sleep(ms = 0) {
	return new Promise(r => setTimeout(r, ms));
}

//Have Main Class as Master
//These class as slaves
//Master does trade, verifies trade went smoothly. Continues listening for events.
//May need queue to handle collisions of events.
export default class SatoshiTrader{
	constructor(profitLog, errorLog, workerNumber, satoshiTradeScout){
		this.satoshiTradeScout = satoshiTradeScout;
		this.workerNumber = workerNumber;
		this.errorLog = errorLog;
		this.profitLog = profitLog;
		this.pair1 = null;
		this.pair2 = null;
		this.pair3 = null;
		this.pair4 = null;
		this.potentialTrade = null;
		this.currencies = satoshiTradeScout.getWork(workerNumber);
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
		let satoshiTrader = this;
		(async () => {
			try {
				async.forever((next)=>
					{
						//Finding new work while waiting before starting to scout for trade..
						satoshiTrader.assignMarketPairs(satoshiTrader.satoshiTradeScout.getWork(satoshiTrader.workerNumber)); //Find more work!
						sleep(API_TIMEOUT).then(()=>{
							satoshiTrader.currencyExchangeCalls(next);
						});
					},
					(err) =>{
						console.log(err);
						console.log("ERror BUBBLING UP HERE");
					}
				);
			} catch (err) {
				console.error(err);
				this.errorLog.error({pair: satoshiTrader.currencies});
			}
		})();
	}
	
	
	/*
	Function used to send out API Calls to the 3 currencies we are monitoring.
	 */
	currencyExchangeCalls(next){
		let satoshiTrader = this;
		async.series({
			one: async (callback) => {
				const markets = await	TradeSatoshi.getOrderBook({market: satoshiTrader.pair1, depth: 1}); // BTC_USDT
				callback(null, markets);
			},
			two: async (callback) =>{
					const markets = await	TradeSatoshi.getOrderBook({market: satoshiTrader.pair2, depth: 1}); // BTC_USDT
					callback(null, markets);
			},
			three: async  (callback) =>{
				const markets = await	TradeSatoshi.getOrderBook({market: satoshiTrader.pair3, depth: 1});  // GRLC_BTC
				callback(null, markets);
			},
			four: async  (callback) =>{
				const markets = await	TradeSatoshi.getOrderBook({market: satoshiTrader.pair4, depth: 1});  //GRLC_LTC
				callback(null, markets);
			},
		}, (err, markets) => {
			satoshiTrader.isProfitableTrade(next, markets);
		})
	}
	
	isProfitableTrade(next, markets){
		let satoshiTrader = this;
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
				let tradeFee = amountSpent * TradeSatoshiFeePrice;
				amountEarned -=  tradeFee;
				amountSpent += tradeFee;gr
				
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
					console.log('nothing, lets try again!');
					//this.log.info({information: markets }, "Test");
					//this.log.info({information: markets})
				//	console.log("This trade is not profitable");
					//this.calculateProfits(markets);
				}
			}
			catch(err){
				//console.log(err);
				this.errorLog.error({pair: satoshiTrader.currencies});
			}
		}
		next(); //Use this to restart the loop..
	}
	
	calculateProfits(markets, profit){
		let satoshiTrader = this;
		let tradeListingOne = new TradeListing(markets.one.buy[0], satoshiTrader.pair1, "buy");
		let tradeListingTwo = new TradeListing(markets.two.sell[0], satoshiTrader.pair2, "sell");
		let tradeListingThree = new TradeListing(markets.three.sell[0], satoshiTrader.pair3, "sell");
		let tradeListingFour = new TradeListing(markets.four.buy[0], satoshiTrader.pair4, "buy");
		
		satoshiTrader.potentialTrade = new Trade(tradeListingOne, tradeListingTwo, tradeListingThree, tradeListingFour);
		satoshiTrader.potentialTrade.updateQuantities().then(() => {
			TradeSatoshiCurrencies.tallyProfitableTrade(satoshiTrader.potentialTrade.lowestPrice * profit);
			
			this.profitLog.info({information: markets, market1: satoshiTrader.pair1,
				market2: satoshiTrader.pair2, market3: satoshiTrader.pair3, market4: satoshiTrader.pair4, profit: profit, lowestPrice: satoshiTrader.potentialTrade.lowestPrice, totalProfit:
				TradeSatoshiCurrencies.profit, trade: satoshiTrader.potentialTrade}, `We Found a profitable Trade! Yay!`);
			
			this.verifyTrade();
		}); //Updates the quantities to correct ones.
		
	}
	verifyTrade(){
		let tradeSatoshi = this;
		if(tradeSatoshi.potentialTrade.isAccountEmpty() || tradeSatoshi.potentialTrade.isBelowMinimum()){
			console.log("Account is empty or we are below minimum amount, Exiting the trade...");
			return;
		}
		
		console.log("Sending Trade to Master worker...");
		
	}
	
	static async getBalances(){
			const balance = await TradeSatoshiCurrencies.getAccountBalance();
			return balance;
	}
	
	 static async setBalances(){
		  const getBalances = await TradeSatoshi.getBalances();
		  console.log("we getting back over here?");
	    await TradeSatoshiCurrencies.setAccountBalance(getBalances);
	 }

}







