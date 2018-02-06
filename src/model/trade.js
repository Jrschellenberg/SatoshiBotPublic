

export default class Trade {
	constructor(tradeListing1, tradeListing2, tradeListing3, tradeListing4, currencies,
	            middleware){
		this.trade1 = tradeListing1.tradeListing;
		this.trade1["usdRateOrder"] = tradeListing1.tradeListing.quantity * tradeListing1.tradeListing.rate;
		//console.log(tradeListing1.quantity * tradeListing1.rate);
		
		this.trade2 = tradeListing2.tradeListing;
		this.trade2["usdRateOrder"] = tradeListing2.tradeListing.quantity * tradeListing2.tradeListing.rate;
		
		this.trade3 = tradeListing3.tradeListing;
		this.trade3["usdRateOrder"] = tradeListing3.tradeListing.quantity * tradeListing3.tradeListing.rate * tradeListing2.tradeListing.rate;
		
		this.trade4 = tradeListing4.tradeListing;
		this.trade4["usdRateOrder"] = tradeListing4.tradeListing.quantity * tradeListing4.tradeListing.rate * tradeListing1.tradeListing.rate;
		
		this.lowestPrice = Math.min(this.trade1.usdRateOrder, this.trade2.usdRateOrder, this.trade3.usdRateOrder, this.trade4.usdRateOrder);
		this.currencies = currencies;
		//this.service = middleware.service;
		
		this.trade1.quantity = (this.lowestPrice / this.trade1.usdRateOrder) * this.trade1.quantity;
		this.trade2.quantity = (this.lowestPrice / this.trade2.usdRateOrder) * this.trade2.quantity;
		
		this.trade3.quantity = (this.lowestPrice / this.trade3.usdRateOrder) * this.trade3.quantity;
		this.trade4.quantity = (this.lowestPrice / this.trade4.usdRateOrder) * this.trade4.quantity;
		
		this.trade1.quantity = Math.floor((this.trade1.quantity * 100000000))/100000000;
		this.trade2.quantity = Math.floor((this.trade2.quantity * 100000000))/100000000;
		
		this.trade3.quantity = Math.floor((this.trade3.quantity * 100000000))/100000000;
		this.trade4.quantity = Math.floor((this.trade4.quantity * 100000000))/100000000;
		
		
		this.trade1["usdRateTrade"] = tradeListing1.tradeListing.quantity * tradeListing1.tradeListing.rate;
		this.trade2["usdRateTrade"] = tradeListing2.tradeListing.quantity * tradeListing2.tradeListing.rate;
		this.trade3["usdRateTrade"] = tradeListing3.tradeListing.quantity * tradeListing3.tradeListing.rate * tradeListing2.tradeListing.rate;
		this.trade4["usdRateTrade"] = tradeListing4.tradeListing.quantity * tradeListing4.tradeListing.rate * tradeListing1.tradeListing.rate;
		
		this.trade1["usdRateTrade"] = this.precisionRound(this.trade1["usdRateTrade"], 8);
		this.trade2["usdRateTrade"] = this.precisionRound(this.trade2["usdRateTrade"], 8);
		this.trade3["usdRateTrade"] = this.precisionRound(this.trade3["usdRateTrade"], 8);
		this.trade4["usdRateTrade"] = this.precisionRound(this.trade4["usdRateTrade"], 8);
		
	}
		
	isBelowMinimum(){
		if(this.trade1.usdRateTrade < 0.05 || this.trade2.usdRateTrade < 0.05 || this.trade3.usdRateTrade < 0.05 || this.trade4.usdRateTrade < 0.05){
			return true;
		}
		return false;
	}
	precisionRound(num, precision){
		let factor = Math.pow(10, precision);
		return Math.round(num * factor)/factor;
	}
	
	async isAccountEmpty(){
		let balance = await this.service.getBalances();
		let currencies = this.currencies;
		currencies.push('USDT');
		for(let i=0; i<currencies.length; i++){
			if(balance[currencies[i]] = 0){
				console.log(`${currencies[i]} has ${balance[currencies[i]]} funds. Therefore we are exiting trade, Please add funds there!`)
				return true; //Don't initiate trade
			}
		}
		return false;
	}
	
	
}