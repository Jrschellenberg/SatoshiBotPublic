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

let NUMBER_SLAVES = 7;

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
	let production = true;
	
	let cryptopiaCurrencies = new CryptopiaCurrencies(cryptopiaService);
	await cryptopiaCurrencies.setBalances(); // Setting up our cryptopia balances for first time..
	console.log(cryptopiaCurrencies.getBalances());

	
	let satoshiCurrencies = new TradeSatoshiCurrencies(tradeSatoshiService);
	await satoshiCurrencies.setBalances();
	console.log(satoshiCurrencies.getBalances());
	
	//let cryptopiaMiddleware = new CryptopiaMiddleware('cryptopia', cryptopiaService, cryptopiaCurrencies );
	let satoshiMiddleware = new SatoshiMiddleware('satoshi',  tradeSatoshiService, satoshiCurrencies );
	
	let tradeMaster = new TradeMaster(successLog, errorLog);
	const utilities = new Utilities();

	 let satoshiTradeScout = new TradeScout(NUMBER_SLAVES, satoshiMarkets);
	// let cryptopiaTradeScout = new TradeScout(NUMBER_SLAVES, cryptopiaMarkets);

	for(let i=0; i<NUMBER_SLAVES; i++){
		new TradeSeeker(profitLog, errorLog, i, satoshiTradeScout, utilities, production, tradeMaster,
			satoshiMiddleware);
			
		//
		// new TradeSeeker(profitLog, errorLog, i, cryptopiaTradeScout, utilities, production, tradeMaster,
		// 	cryptopiaMiddleware);
	}
	
	
	
})();