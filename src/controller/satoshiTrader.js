import async from 'async';
import timeout from 'async/timeout';

import {API_CREDENTIALS} from "../service/secret";
import TradeSatoshiCurrencies from "../model/tradeSatoshiAccountBalance";

const TradeSatoshi = require('../service/satoshiAPI')();
const TradeSatoshiFeePrice = 0.002;
const API_TIMEOUT = 4000;
let singletonInstance = null;

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
		this.log = logger;
		this.pair1 = marketPairings[0]+'_USDT';
		this.pair2 = marketPairings[1]+'_USDT';
		this.pair3 = marketPairings[2]+'_'+marketPairings[1];
		this.pair4 = marketPairings[2]+'_'+marketPairings[0];
		this.process();
	}
	
	process(){
		console.log("hello from satoshitrader!");
		let satoshiTrader = this;
		(async () => {
			try {
				//satoshiTrader.currencyExchangeCalls();
				async.forever((next)=>
					{
						sleep(API_TIMEOUT).then(()=>{
							//console.log("Starting over..........");
							satoshiTrader.currencyExchangeCalls(next);
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
					const markets = await	TradeSatoshi.getOrderBook({market: satoshiTrader.pair1, depth: 1}); //LTC_USDT
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
			// console.log("hitting end!");
			// console.log(markets);
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
			
			let pair1Price = marketOne.rate;                       // Buying price USD
			let amountEarned = marketFour.rate * pair1Price;        //Buying price USD
			let pair2Price = marketTwo.rate;                        //Selling price USD
			let amountSpent = marketThree.rate * pair2Price;        //Selling price USD
			let tradeFee = amountSpent * TradeSatoshiFeePrice;
			amountEarned -=  tradeFee;
			amountSpent += tradeFee;
			
			console.log(`Amount spent is ${amountSpent}`);
			console.log(`Amount Earned is ${amountEarned}`);
			
			if(amountEarned > amountSpent){
				let profit = amountEarned - amountSpent;
				console.log("This trade is profitable");
				this.log.info({information: markets, market1: satoshiTrader.pair1, 
					market2: satoshiTrader.pair2, market3: satoshiTrader.pair3, market4: satoshiTrader.pair4, profit: profit }, `We Found a profitable Trade! Yay!`);
				
				this.calculateProfits(markets);
			}
			else{
				//this.log.info({information: markets }, "Test");
				//this.log.info({information: markets})
				console.log("This trade is not profitable");
				//this.calculateProfits(markets);
			}
		}
		next(); //Use this to restart the loop..
	}
	
	calculateProfits(markets){
		let marketOneRate = markets.one.buy[0].rate;
		let marketTwoRate = markets.two.sell[0].rate;
		let marketOnePrice, marketTwoPrice, marketThreePrice, marketFourPrice;
		
		marketOnePrice = marketOneRate * markets.one.buy[0].quantity;
		marketTwoPrice = marketTwoRate * markets.two.sell[0].quantity;
		marketThreePrice = markets.three.sell[0].rate * markets.three.sell[0].quantity * marketTwoRate;
		marketFourPrice = markets.four.buy[0].rate * markets.four.buy[0].quantity * marketOneRate;
		
		console.log(marketOnePrice);
		console.log(marketTwoPrice);
		console.log(marketThreePrice);
		console.log(marketFourPrice);
		let lowest = Math.min(marketOnePrice, marketTwoPrice, marketThreePrice, marketFourPrice);
		console.log(lowest);
		
	}
	
	static async getBalances(log){
			const balance = await TradeSatoshiCurrencies.getAccountBalance();
			console.log("Got balance already;");
			log.info({information: balance }, "Balanced");
			console.log(balance); //Object with Deposit Address data from API
	}
	
	 static async setBalances(){
			 const getBalances = await TradeSatoshi.getBalances();
		    console.log("Got Balances");
				await TradeSatoshiCurrencies.setAccountBalance(getBalances);
				console.log("finished balances");
		}
}







