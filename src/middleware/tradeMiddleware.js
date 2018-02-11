const API_TIMEOUT = 800;

export default class TradeMiddleware {
	constructor(marketListing, marketFee, service, marketBalances){
		if(new.target === TradeMiddleware){
			throw new TypeError("Cannot construct the TradeMiddleware instances directly!");
		}
		this.marketListing = marketListing;
		this.API_TIMEOUT = API_TIMEOUT;
		this.marketFee = marketFee;
		this.marketBalances = marketBalances;
		this.service = service
	}
	
	getMarketFee(){
		return this.marketFee;
	}
	
	isUSDT(param){
		if(!param)return false;
		return param.toLowerCase() === 'usdt';
	}
	isBTC(param){
		if(!param)return false;
		return param.toLowerCase() === 'btc';
	}
	isLTC(param){
		if(!param)return false;
		return param.toLowerCase() === 'ltc';
	}
	isDOGE(param){
		if(!param)return false;
		return param.toLowerCase() === 'doge';
	}
	isBCH(param){
		if(!param)return false;
		return param.toLowerCase() === 'bch';
	}
	isNZDT(param){
		if(!param)return false;
		return param.toLowerCase() === 'nzdt';
	}
}