require("babel-polyfill"); //This should go first
let bunyan = require('bunyan');
import SatoshiTrader from "./controller/satoshiTrader";
//import TradeSatoshiCurrencies from "./model/tradeSatoshiAccountBalance";


let log = bunyan.createLogger({
	name: "myapp",
	streams: [
		{
			level: 'info',
			path: './profitable.log'
		}
	]
});

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

// let marketPairings = [["LTC", "BTC", "GRLC"],
// 											["BTC", "LTC", "GRLC"],
// 											["DOGE", "LTC", "GRLC"],
// 											["DOGE", "BTC", "GRLC"],
// 											["LTC", "DOGE", "GRLC"],
// 											["BTC", "DOGE", "GRLC"],
//	
// 											["BTC", "LTC", "DOGE"],
// 											["LTC", "BTC", "DOGE"],
// 											["BCH", "LTC", "GRLC"],
// 											["LTC", "BCH", "GRLC"],
//											
//	
//										
// 											];
// for(let i=0; i<marketPairings.length; i++){
// 	new SatoshiTrader(marketPairings[i], log);
// }
(async function () {
//new TradeSatoshiCurrencies();
 await	SatoshiTrader.getBalances(log);
await  SatoshiTrader.setBalances();
await 	SatoshiTrader.getBalances(log);
	
})();





