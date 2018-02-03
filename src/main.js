require("babel-polyfill"); //This should go first
let bunyan = require('bunyan');
import SatoshiTrader from "./controller/satoshiTrader";
import TradeScout from "./controller/tradeScout";
import {marketPairings} from "./markets";

let NUMBER_SLAVES = 12;

let profitLog = bunyan.createLogger({
	name: "myapp",
	streams: [
		{
			level: 'info',
			path: './profitable.log'
		}
	]
});
let errorLog = bunyan.createLogger({
	name: "myapp",
	streams: [
		{
			level: 'error',
			path: './error.log'
		}
	]
});

(async function () {
	await  SatoshiTrader.setBalances();
	// let balance = await SatoshiTrader.getBalances()
	// console.log(balance);
	// console.log(marketPairings.length);
	
	//Initializing Robots To Trade
	//Entry Point into Program.
	//Pick three currencies  to check, fourth will always be USDT ie LTC, BTC, GRLC
	//Pairings are nFactorial 
	
	/*
	Market pairings Documentation
	@Param 1 = market to earn profit with.
	@Param 2 = market to incure losses with
	@Param 3 = Market to manipulate.
	 */
	// let marketPairings = [["BTC", "DOGE", "GRLC"],
	// 	["DOGE", "BTC", "GRLC"]];
	
//Initialize our TradeScout
	 let satoshiTradeScout = new TradeScout(NUMBER_SLAVES, marketPairings);	
	for(let i=0; i<NUMBER_SLAVES; i++){
		new SatoshiTrader(profitLog, errorLog, i, satoshiTradeScout);
	}
})();





