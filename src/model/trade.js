

export default class Trade {
	constructor(tradeListing1, tradeListing2, tradeListing3, currencies,
	            middleware){
		this.completedTrade1 = null;
		this.completedTrade2 = null;
		this.completedTrade3 = null;
		this.trade1 = tradeListing1.tradeListing;
		this.trade1["usdRateOrder"] = tradeListing1.tradeListing.quantity * tradeListing1.tradeListing.rate;
		this.trade1['limitingReagent'] = false;
		//console.log(tradeListing1.quantity * tradeListing1.rate);
		
		this.trade2 = tradeListing2.tradeListing;
		this.trade2["usdRateOrder"] = tradeListing2.tradeListing.quantity * tradeListing2.tradeListing.rate;
		this.trade2['limitingReagent'] = false;
		
		this.trade3 = tradeListing3.tradeListing;
		this.trade3["usdRateOrder"] = tradeListing3.tradeListing.quantity * tradeListing3.tradeListing.rate * tradeListing2.tradeListing.rate;
		this.trade3['limitingReagent'] = false;
		
		this.lowestPrice = Math.min(this.trade1.usdRateOrder, this.trade2.usdRateOrder, this.trade3.usdRateOrder);
		this.currencies = currencies;
		this.middleware = middleware;
		
		this.calculateStartTrade();
		
		//this.executeTrade();
		
		// this.trade1.quantity = (this.lowestPrice / this.trade1.usdRateOrder) * this.trade1.quantity;
		// this.trade2.quantity = (this.lowestPrice / this.trade2.usdRateOrder) * this.trade2.quantity;
		//
		// this.trade3.quantity = (this.lowestPrice / this.trade3.usdRateOrder) * this.trade3.quantity;
		//
		// this.trade1.quantity = Math.floor((this.trade1.quantity * 100000000))/100000000;
		// this.trade2.quantity = Math.floor((this.trade2.quantity * 100000000))/100000000;
		//
		// this.trade3.quantity = Math.floor((this.trade3.quantity * 100000000))/100000000;
		
		
		// this.trade1["usdRateTrade"] = tradeListing1.tradeListing.quantity * tradeListing1.tradeListing.rate;
		// this.trade2["usdRateTrade"] = tradeListing2.tradeListing.quantity * tradeListing2.tradeListing.rate;
		// this.trade3["usdRateTrade"] = tradeListing3.tradeListing.quantity * tradeListing3.tradeListing.rate * tradeListing2.tradeListing.rate;
		
		
		//Don't want to round yet because need to figure which 1 is lowest
		
		// this.trade1["usdRateOrder"] = this.precisionRound(this.trade1["usdRateOrder"], 8);
		// this.trade2["usdRateOrder"] = this.precisionRound(this.trade2["usdRateOrder"], 8);
		// this.trade3["usdRateOrder"] = this.precisionRound(this.trade3["usdRateOrder"], 8);
		
	}
	
	calculateStartTrade(){
		if(this.lowestPrice === this.trade1.usdRateOrder){
			this.trade1['limitingReagent'] = true;
		}
		else if(this.lowestPrice === this.trade2.usdRateOrder){
			this.trade2['limitingReagent'] = true;
		}
		else if(this.lowestPrice === this.trade3.usdRateOrder){
			this.trade3['limitingReagent'] = true;
		}
		else{
			//AN error occurred..
			console.log("An error occured while trying to determine the starting trade..")
		}
	}
	executeTrade(){
		this.completedTrade1['rate'] = this.trade1.rate;
		this.completedTrade2['rate'] = this.trade2.rate;
		this.completedTrade3['rate'] = this.trade3.rate;
		this.completedTrade1['trade'] = 'SELL';
		this.completedTrade2['trade'] = 'BUY';
		this.completedTrade3['trade'] = 'BUY';
		
		if(this.trade1.limitingReagent){
			this.completedTrade1['quantity'] = this.trade1.quantity;
			
			this.completedTrade3['quantity'] = this.computeTrade(this.trade1.quantity, this.trade1.rate, this.middleware.marketFee, 'sell');
			
			this.completedTrade2['quantity'] = this.computeTrade(this.completedTrade3.quantity, this.trade3.rate, this.middleware.marketFee, 'buy');
			
		}
		else if(this.trade2.limitingReagent){
			this.completedTrade2['quantity'] = this.trade2.quantity;
			
			this.completedTrade1['quantity'] = this.computeTrade(this.trade2.quantity, this.trade2.rate, this.middleware.marketFee, 'buy');
			
			this.completedTrade3['quantity'] = this.computeTrade(this.completedTrade1.quantity, this.trade1.rate, this.middleware.marketFee, 'sell');
			//do trade from start at 2
			
		}
		else if(this.trade3.limitingReagent){
			this.completedTrade3['quantity'] = this.trade3.quantity;
			
			this.completedTrade2['quantity'] = this.computeTrade(this.trade3.quantity, this.trade3.rate, this.middleware.marketFee, 'buy');
			
			this.completedTrade1['quantity'] = this.computeTrade(this.completedTrade2.quantity, this.trade2.rate, this.middleware.marketFee, 'buy');
			//do trade from start at 3
		}
		else{
			console.log("a error occured while establishing profits and trades...");
		}
		
	}
	
	computeTrade(quantity, rate, fee, tradeType){
		let tradeFee = (quantity * rate) * fee;
		tradeFee = this.precisionRound(tradeFee, 8);
		let sum = quantity * rate;
		if(tradeType.toLowerCase() === 'buy'){
			return sum + tradeFee;
		}
		else if(tradeType.toLowerCase() === 'sell'){
			return sum - tradeFee;
		}
	}
	
		
	isBelowMinimum(){
		if(this.trade1.usdRateTrade < 0.05 || this.trade2.usdRateTrade < 0.05 || this.trade3.usdRateTrade < 0.05){
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