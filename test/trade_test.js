import Trade from "../src/model/trade";
import TradeListing from "../src/model/tradeListing";
import Utilities from "../src/utilities";
import CryptopiaMiddleware from "../src/middleware/cryptopiaMiddleware";

const expect = require('chai').expect;

let utilities = new Utilities();
let middleware = new CryptopiaMiddleware

let market1 = {
	quantity: 0.12971306,
	rate: 887.77332964
};
let market2 = {
	quantity: 105.61429483,
	rate: 0.80385059
};
let market3 = {
	quantity: 0.04750243,
	rate: 1118.87999281
}

let tradeListing1 = new TradeListing(market1, "ETH_USDT", 'buy');
let tradeListing2 = new TradeListing(market2, "NZDT_USDT", 'sell');
let tradeListing3 = new TradeListing(market3, "ETH_NZDT", 'sell');

let trade = new Trade(tradeListing1, tradeListing2, tradeListing3)

describe('calculateProfitEarned', () => {
	
	
});