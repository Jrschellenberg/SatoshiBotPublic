require("babel-polyfill"); //This should go first
let bunyan = require('bunyan');
import TradeSeeker from "./controller/tradeSeeker";
import TradeScout from "./controller/tradeScout";
import {SatoshiMiddleware, TradeSatoshiCurrencies} from "./middleware/satoshiMiddleware";
import {CryptopiaMiddleware, CryptopiaCurrencies} from "./middleware/cryptopiaMiddleware";
import Utilities from './utilities';
import {satoshiMarkets} from "./satoshiMarkets";
import {cryptopiaMarkets} from "./cryptopiaMarkets";
import {API_CREDENTIALS, CRYPTOPIA_CREDENTIALS} from "./service/secret";
import TradeMaster from "./controller/tradeMaster";

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

let NUMBER_SLAVES = 10;

let successLog = bunyan.createLogger({
	name: "myapp",
	streams: [
		{
			level: 'info',
			path: './Success.log'
		}
	]
});
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
	//await  TradeSatoshiCurrencies.setBalances(tradeSatoshiService);
	let cryptopiaCurrencies = new CryptopiaCurrencies(cryptopiaService);
	await cryptopiaCurrencies.setBalances(); // Setting up our cryptopia balances for first time..
	let production = true;
	
	let cryptopiaTradeMaster = new TradeMaster(successLog, errorLog);
	let cryptopiaMiddleware = new CryptopiaMiddleware('cryptopia', cryptopiaService, cryptopiaCurrencies );
	//let cryptopiaMiddleware = new 
	// let balance = await cryptopiaCurrencies.getBalances();
	// console.log(balance);
	
	// let balance = await SatoshiTrader.getBalances()
	// console.log(balance);
	// console.log(marketPairings.length);
	
	/*
	Market pairings Documentation
	@Param 1 = market to earn profit with.
	@Param 2 = market to incure losses with
	@Param 3 = Market to manipulate.
	 */

	
//Initialize our TradeScout
	
	const utilities = new Utilities();
	
	 let satoshiTradeScout = new TradeScout(NUMBER_SLAVES, satoshiMarkets);

	 let cryptopiaTradeScout = new TradeScout(NUMBER_SLAVES, cryptopiaMarkets);

	for(let i=0; i<NUMBER_SLAVES; i++){
		// new TradeSeeker(profitLog, errorLog, i, satoshiTradeScout, utilities, production
		// 	new SatoshiMiddleware('satoshi', TRADE_SATOSHI_TRADE_FEE, tradeSatoshiService ));

		new TradeSeeker(profitLog, errorLog, i, cryptopiaTradeScout, utilities, production, cryptopiaTradeMaster,
			cryptopiaMiddleware);
	}
})();





