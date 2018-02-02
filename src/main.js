require("babel-polyfill"); //This should go first
let bunyan = require('bunyan');
import SatoshiTrader from "./controller/satoshiTrader";
import SatoshiTradeScout from "./controller/SatoshiTradeScout";
//import TradeSatoshiCurrencies from "./model/tradeSatoshiAccountBalance";

import {marketPairings} from "./markets";

let NUMBER_SLAVES = 1;


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
//new TradeSatoshiCurrencies();
await  SatoshiTrader.setBalances();
console.log(SatoshiTrader.getBalances());

console.log(marketPairings.length);




//Initialize our TradeScout
	
//	await SatoshiTradeScout.createInstance(NUMBER_SLAVES, marketPairings);
	
	


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

//
// for(let i=0; i<NUMBER_SLAVES; i++){
// 	//console.log(i);
// 	new SatoshiTrader(SatoshiTradeScout.getWork(i), profitLog, errorLog, i);
// }
//	
})();





