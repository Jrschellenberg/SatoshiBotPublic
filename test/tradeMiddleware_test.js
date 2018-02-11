import {CryptopiaMiddleware, CryptopiaCurrencies} from "../src/middleware/cryptopiaMiddleware";
import {API_CREDENTIALS, CRYPTOPIA_CREDENTIALS} from "../src/service/secret";
const expect = require('chai').expect;
const cryptopiaService = require('../src/service/cryptopiaAPI')();
const cryptopiaOptions = {
	API_KEY: CRYPTOPIA_CREDENTIALS.KEY,
	API_SECRET: CRYPTOPIA_CREDENTIALS.SECRET
};
cryptopiaService.setOptions(cryptopiaOptions);

let cryptopiaCurrencies = new CryptopiaCurrencies(cryptopiaService);

let middleware = new CryptopiaMiddleware('cryptopia', cryptopiaService, cryptopiaCurrencies );

describe('TradeMiddleware - Constructor', () => {
	it('should set values to expected values', () => {
		expect(middleware.marketListing).to.be.equal('cryptopia');
		expect(middleware.marketBalances).to.be.equal(cryptopiaCurrencies);
		expect(middleware.service).to.be.equal(cryptopiaService);
	});
});

describe('TradeMiddleware - getMarketFee', () => {
	it('should return the marketFee when called', () => {
		expect(middleware.getMarketFee()).to.be.equal(middleware.marketFee);
	});
});

describe('TradeMiddleware - isUSDT', () => {
	it('should return true if param is equal to usdt', () => {
		expect(middleware.isUSDT('usdt')).to.be.true;
		expect(middleware.isUSDT('USdt')).to.be.true;
	});
	it('should return false if param is not equal to usdt', () => {
		expect(middleware.isUSDT('wedt')).to.be.false;
		expect(middleware.isUSDT(null)).to.be.false;
	});
});

describe('TradeMiddleware - isBTC', () => {
	it('should return true if param is equal to btc', () => {
		expect(middleware.isBTC('btc')).to.be.true;
		expect(middleware.isBTC('Btc')).to.be.true;
	});
	it('should return false if param is not equal to btc', () => {
		expect(middleware.isBTC('wedt')).to.be.false;
		expect(middleware.isBTC(null)).to.be.false;
	});
});

describe('TradeMiddleware - isLTC', () => {
	it('should return true if param is equal to ltc', () => {
		expect(middleware.isLTC('ltc')).to.be.true;
		expect(middleware.isLTC('ltc')).to.be.true;
	});
	it('should return false if param is not equal to ltc', () => {
		expect(middleware.isLTC('se')).to.be.false;
		expect(middleware.isLTC(null)).to.be.false;
	});
});

describe('TradeMiddleware - isDoge', () => {
	it('should return true if param is equal to Doge', () => {
		expect(middleware.isDOGE('Doge')).to.be.true;
		expect(middleware.isDOGE('DOGE')).to.be.true;
	});
	it('should return false if param is not equal to Doge', () => {
		expect(middleware.isDOGE('asdfwese')).to.be.false;
		expect(middleware.isDOGE(null)).to.be.false;
	});
});

describe('TradeMiddleware - isBCH', () => {
	it('should return true if param is equal to BCH', () => {
		expect(middleware.isBCH('BCH')).to.be.true;
		expect(middleware.isBCH('bcH')).to.be.true;
	});
	it('should return false if param is not equal to BCH', () => {
		expect(middleware.isBCH('afwese')).to.be.false;
		expect(middleware.isBCH(null)).to.be.false;
	});
});

describe('TradeMiddleware - isNZDT', () => {
	it('should return true if param is equal to NZDT', () => {
		expect(middleware.isNZDT('NZDT')).to.be.true;
		expect(middleware.isNZDT('nzdT')).to.be.true;
	});
	it('should return false if param is not equal to NZDT', () => {
		expect(middleware.isNZDT('afe')).to.be.false;
		expect(middleware.isNZDT(null)).to.be.false;
	});
});