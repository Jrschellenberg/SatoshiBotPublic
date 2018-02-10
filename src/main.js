require("babel-polyfill"); //This should go first
let bunyan = require('bunyan');
import TradeSeeker from "./controller/tradeSeeker";
import TradeScout from "./controller/tradeScout";
import {SatoshiMiddleware, TradeSatoshiCurrencies} from "./middleware/satoshiMiddleware";
import {CryptopiaMiddleware, CryptopiaCurrencies} from "./middleware/cryptopiaMiddleware";

import {satoshiMarkets} from "./satoshiMarkets";
import {cryptopiaMarkets} from "./cryptopiaMarkets";
import {API_CREDENTIALS, CRYPTOPIA_CREDENTIALS} from "./service/secret";

const tradeSatoshiService = require('./service/satoshiAPI')();
const tradeSatoshiOptions = {
	API_KEY: API_CREDENTIALS.KEY,
	API_SECRET: API_CREDENTIALS.SECRET
};
tradeSatoshiService.setOptions(tradeSatoshiOptions);

const cryptopiaService = require('./service/cryptopiaAPI')();
const cryptopiaOptions = {
	API_KEY: CRYPTOPIA_CREDENTIALS.KEY,
	API_SECRET: CRYPTOPIA_CREDENTIALS.SECRET
};
cryptopiaService.setOptions(cryptopiaOptions);

const TRADE_SATOSHI_TRADE_FEE = 0.002;
const CRYPTOPIA_TRADE_FEE = 0.002;
const API_TIMEOUT = 800;

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
	await  TradeSatoshiCurrencies.setBalances(tradeSatoshiService);
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
	
	
	
	 let satoshiTradeScout = new TradeScout(NUMBER_SLAVES, satoshiMarkets);
	
	 let cryptopiaTradeScout = new TradeScout(NUMBER_SLAVES, cryptopiaMarkets);
	
	for(let i=0; i<NUMBER_SLAVES; i++){
		// new TradeSeeker(profitLog, errorLog, i, satoshiTradeScout,
		// 	new SatoshiMiddleware(TRADE_SATOSHI_TRADE_FEE, tradeSatoshiService,API_TIMEOUT ));
		
		new TradeSeeker(profitLog, errorLog, i, cryptopiaTradeScout,
			new CryptopiaMiddleware(CRYPTOPIA_TRADE_FEE, cryptopiaService,API_TIMEOUT ));
	}
})();





