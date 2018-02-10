export default class Trade {
	constructor(tradeListing1, tradeListing2, tradeListing3, currencies,
	            middleware){
		this.completedTrade1 = {};
		this.completedTrade2 = {};
		this.completedTrade3 = {};
		this.trade1 = tradeListing1.tradeListing;
		this.trade1.usdRateOrder = tradeListing1.tradeListing.quantity * tradeListing1.tradeListing.rate;
		this.trade1.limitingReagent = false;
		//console.log(tradeListing1.quantity * tradeListing1.rate);
		
		this.trade2 = tradeListing2.tradeListing;
		this.trade2.usdRateOrder = tradeListing2.tradeListing.quantity * tradeListing2.tradeListing.rate;
		this.trade2.limitingReagent = false;
		
		this.trade3 = tradeListing3.tradeListing;
		this.trade3.usdRateOrder = tradeListing3.tradeListing.quantity * tradeListing3.tradeListing.rate * tradeListing2.tradeListing.rate;
		this.trade3.limitingReagent = false;
		
		this.lowestPrice = Math.min(this.trade1.usdRateOrder, this.trade2.usdRateOrder, this.trade3.usdRateOrder);
		this.currencies = currencies;
		this.middleware = middleware;
		this.profit = null;
		
		this.calculateStartTrade();
		this.executeTrade();
		this.calculateProfit();
		
	}
	
	calculateStartTrade(){
		if(this.lowestPrice === this.trade1.usdRateOrder){
			this.trade1.limitingReagent = true;
		}
		else if(this.lowestPrice === this.trade2.usdRateOrder){
			this.trade2.limitingReagent = true;
		}
		else if(this.lowestPrice === this.trade3.usdRateOrder){
			this.trade3.limitingReagent = true;
		}
		else{
			//AN error occurred..
			console.log("An error occured while trying to determine the starting trade..")
		}
	}
	executeTrade(){
		this.completedTrade1.rate = this.trade1.rate;
		this.completedTrade2.rate = this.trade2.rate;
		this.completedTrade3.rate = this.trade3.rate;
		this.completedTrade1.trade = 'SELL';
		this.completedTrade2.trade = 'BUY';
		this.completedTrade3.trade = 'BUY';
		
		this.completedTrade3.quantity = this.precisionRound(((this.lowestPrice / this.trade3.usdRateOrder) * this.trade3.quantity), 8);
		
		this.completedTrade2.quantity = this.precisionRound(this.computeTrade(this.completedTrade3.quantity, this.trade3.rate, this.middleware.marketFee, 'buy'), 8);
		
		this.completedTrade1.quantity = this.completedTrade3.quantity;
	}
	
	calculateProfit(){
		let profitEarned = (this.completedTrade1.rate * this.completedTrade1.quantity) - ((this.completedTrade1.quantity * this.completedTrade1.rate) * this.middleware.marketFee);
		let amountSpent = (this.completedTrade3.quantity * this.completedTrade3.rate * this.completedTrade2.rate) + ((this.completedTrade3.quantity * this.completedTrade3.rate * this.completedTrade2.rate) * (2*this.middleware.marketFee));
		this.profit = (profitEarned - amountSpent).toString() + this.currencies[2];
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
	
	precisionRound(num, precision){
		let factor = Math.pow(10, precision);
		return Math.round(num * factor)/factor;
	}
	
	
	async isSufficientFunds(){
		let balance = await this.middleware.marketBalances.getBalances();
		console.log(balance);
		let currencies = this.currencies;
		console.log(currencies);
		console.log(balance[this.currencies[1]]);
		return balance[this.currencies[1]] && balance[this.currencies[2]] && 
			(balance[this.currencies[1]].coins >  this.completedTrade2.quantity ) && 
			(balance[this.currencies[2]].coins > (this.completedTrade2.quantity * this.completedTrade2.rate));
		//Need to have enough of quantity 2 for Trade 3's market, as well as have enough of quantity 2 * rate for trade 2's market..
		
}
	
}