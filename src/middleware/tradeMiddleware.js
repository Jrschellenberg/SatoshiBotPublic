
export default class TradeMiddleware {
	constructor(marketFee, service, API_TIMEOUT){
		if(new.target === TradeMiddleware){
			throw new TypeError("Cannot construct the TradeMiddleware instances directly!");
		}
		this.marketListing = null;
		this.API_TIMEOUT = API_TIMEOUT;
		this.marketFee = marketFee;
		this.service = service
	}
	
	getMarketFee(){
		return this.marketFee;
	}
	
	
}