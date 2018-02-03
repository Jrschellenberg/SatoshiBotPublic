import {TradeMiddleware} from './tradeMiddleware';

export default class SatoshiMiddleware extends TradeMiddleware {
	constructor(marketFee, service){
		super(service);
	}
	
	async getMarketListing(params){
		 const market = await this.service.getOrderBook(params);
		 return market;		
	}
	
}