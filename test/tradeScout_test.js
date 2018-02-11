import {cryptopiaMarkets} from "../src/cryptopiaMarkets";
import TradeScout from "../src/controller/tradeScout";
const expect = require('chai').expect;

let NUMBER_SLAVES = 1;

let cryptopiaTradeScout = new TradeScout(NUMBER_SLAVES, cryptopiaMarkets);


describe('TradeScout - Constructor', () => {
	it('should set values to expected values', () => {
		expect(cryptopiaTradeScout.numberOfSlaves).to.be.equal(NUMBER_SLAVES);
		expect(cryptopiaTradeScout.marketPairings).to.be.equal(cryptopiaMarkets);
	});
});

describe("TradeScout - getWork", () => {
	it('should return 3 market pairings for a slave trade seeker', () => {
		expect(cryptopiaTradeScout.getWork(0)).to.be.equal(cryptopiaMarkets[0]);
	});
});