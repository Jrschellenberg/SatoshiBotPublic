export default class TradeListing {
	constructor(market, pair, listing){
		this.tradeListing = {
			pair: pair,
			type: listing,
			quantity: market.quantity,
			rate: market.rate
		}
		
		
		
	}
	
	
	
}