import async from 'async';
import timeout from 'async/timeout';
import {API_CREDENTIALS} from "../service/secret";

const TradeSatoshi = require('../service/satoshiAPI')();
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
	constructor(currencies){
		this.satoshi = TradeSatoshi;
		this.currencies = currencies;
		this.process();
		this.API_REQUEST_TIMEOUT = 2000;
	}
	
	process(){
		const API_TIMEOUT = this.API_REQUEST_TIMEOUT;
		console.log("hello from satoshitrader!");
		let satoshiTrader = this;
		(async () => {
			try {
				async.forever((next)=>
					{
						sleep(1000).then(()=>{
							if(satoshiTrader.currencyExchangeCalls()){
								next();
							}
						})
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
	currencyExchangeCalls(){
		console.log("hello");
		return true;
	}
	
}