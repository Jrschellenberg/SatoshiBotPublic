import async from 'async';
import timeout from 'async/timeout';
import {API_CREDENTIALS} from "../service/secret";

const TradeSatoshi = require('../service/satoshiAPI')();
const TradeSatoshiFeePrice = 0.002;
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
//Slaves send out 3 calls. Find profitable trades.
//Slaves Tell master about trade.
//Slave continues seeking profitable trade
//Master does trade, verifies trade went smoothly. Continues listening for events.
//May need queue to handle collisions of events.
export default class SatoshiTrader{
	constructor(marketPairings, logger){
		//this.satoshi = TradeSatoshi;
		this.log = logger;
		this.pair1 = marketPairings[0]+'_USDT';
		this.pair2 = marketPairings[1]+'_USDT';
		this.pair3 = marketPairings[2]+'_'+marketPairings[1];
		this.pair4 = marketPairings[2]+'_'+marketPairings[0];
		this.marketPairings = marketPairings;
		this.process();
	//	this.updatePrices();
		this.API_REQUEST_TIMEOUT = 2000;
	}
	
	process(){
		const API_TIMEOUT = this.API_REQUEST_TIMEOUT;
		console.log("hello from satoshitrader!");
		let satoshiTrader = this;
		(async () => {
			try {
				//satoshiTrader.currencyExchangeCalls();
				async.forever((next)=>
					{
						sleep(4000).then(()=>{
							console.log("Starting over..........");
							satoshiTrader.currencyExchangeCalls(next);
						});
						sleep(6000).then(()=>{
							
						});
					},
					(err) =>{
						console.log(err);
					}
				);
			} catch (err) {
				console.error(err);
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
					const markets = await	TradeSatoshi.getTicker({market: satoshiTrader.pair1}); //LTC_USDT
					callback(null, markets);
			},
			two: async (callback) =>{
					const markets = await	TradeSatoshi.getTicker({market: satoshiTrader.pair2}); // BTC_USDT
					callback(null, markets);
			},
			three: async  (callback) =>{
				const markets = await	TradeSatoshi.getTicker({market: satoshiTrader.pair3});  // GRLC_BTC
				callback(null, markets);
			},
			four: async  (callback) =>{
				const markets = await	TradeSatoshi.getTicker({market: satoshiTrader.pair4}); //GRLC_LTC
				callback(null, markets);
			},
		}, (err, markets) => {
			console.log("hitting end!");
			console.log(markets);
			satoshiTrader.isProfitableTrade(next, markets);
			
			//return true;
			//this.process();
			// results is now equal to: {one: 1, two: 2}
		})
	}
	
	isProfitableTrade(next, markets){
		let marketOne = markets.one,
			marketTwo = markets.two,
			marketThree = markets.three,
			marketFour = markets.four;
		
		let pair1Price = marketOne.bid;
		let amountEarned = marketFour.bid * pair1Price;
		
		let pair2Price = marketTwo.ask;
		
		let amountSpent = marketThree.ask * pair2Price;
		
		let tradeFee = amountSpent * TradeSatoshiFeePrice;
		
		amountSpent += tradeFee;
		
		console.log(`Amount spent is ${amountSpent}`);
	
		console.log(`Amount Earned is ${amountEarned}`);
		
		if(amountEarned > amountSpent){
			let profit = amountEarned - amountSpent;
			console.log("This trade is profitable");
			this.log.info({informatoin: markets, profit: profit }, `We Found a profitable Trade! Yay!`);
		}
		else{
			//this.log.info({information: markets }, "Test");
			console.log("This trade is not profitable");
		}
		next(); //Use this to restart the loop..
	}
	
	
	
}