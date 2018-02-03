
export default class TradeMiddleware {
	constructor(marketFee, service){
		if(new.target === TradeMiddleware){
			throw new TypeError("Cannot construct the TradeMiddleware instances directly!");
		}
		this.marketListing = null;
		this.marketFee = marketFee;
		this.service = service
	}
	
	getMarketListing(){
		
	}
	
	getMarketFee(){
		return this.marketFee;
	}
	
}