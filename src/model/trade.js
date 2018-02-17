export default class Trade {
	constructor(tradeListing1, tradeListing2, tradeListing3, currencies, utilities,
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
		this.utilities = utilities;
		
		this.calculateStartTrade();
		this.executeTrade(1);
		
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
			console.log("An error occured while trying to determine the starting trade..")
		}
	}
	executeTrade(ratio){
		this.completedTrade1.pair = this.trade1.pair;
		this.completedTrade2.pair = this.trade2.pair;
		this.completedTrade3.pair = this.trade3.pair;
		
		this.completedTrade1.rate = this.trade1.rate - 0.00000002;
		this.completedTrade2.rate = this.trade2.rate + 0.00000002;
		this.completedTrade3.rate = this.trade3.rate + 0.00000002;
		
		this.completedTrade1.trade = 'SELL';
		this.completedTrade2.trade = 'BUY';
		this.completedTrade3.trade = 'BUY';
		
		this.completedTrade3.quantity = this.utilities.precisionRound(ratio* (((this.lowestPrice / this.trade3.usdRateOrder) * this.trade3.quantity)), 8);
		
		this.completedTrade2.quantity = this.utilities.precisionRound(this.computeTrade(this.completedTrade3.quantity, this.trade3.rate, this.middleware.marketFee, 'buy'), 8);
		
		this.completedTrade1.quantity = this.completedTrade3.quantity;
		
		this.profit = this.calculateProfit();
		this.displayProfit = this.profit.toString() + this.currencies[2];
		
	}
	
	isProfitable(){
		return this.profit > 0;
	}
	
	calculateProfit(){
		let profitEarned = this.calculateProfitEarned(this.completedTrade1.rate, this.completedTrade1.quantity, this.middleware.marketFee);
		let amountSpent = this.calculateAmountSpent(this.completedTrade3.quantity, this.completedTrade3.rate, this.completedTrade2.rate, this.middleware.marketFee );
		//let profitEarned = (this.completedTrade1.rate * this.completedTrade1.quantity) - ((this.completedTrade1.quantity * this.completedTrade1.rate) * this.middleware.marketFee);
		//let amountSpent = (this.completedTrade3.quantity * this.completedTrade3.rate * this.completedTrade2.rate) + ((this.completedTrade3.quantity * this.completedTrade3.rate * this.completedTrade2.rate) * (2*this.middleware.marketFee));
		return this.utilities.precisionRound((profitEarned - amountSpent), 8);
	}
	
	calculateProfitEarned(completedTrade1Rate, completedTrade1Quantity, marketFee){
		return (completedTrade1Rate * completedTrade1Quantity) - ((completedTrade1Quantity * completedTrade1Rate) * marketFee);
	}
	calculateAmountSpent(completedTrade3Quantity, completedTrade3Rate, completedTrade2Rate, marketFee){
		return (completedTrade3Quantity * completedTrade3Rate * completedTrade2Rate) + ((completedTrade3Quantity * completedTrade3Rate * completedTrade2Rate) * (2 * marketFee));
	}
	
	computeTrade(quantity, rate, fee, tradeType){
		let tradeFee = (quantity * rate) * fee;
		tradeFee = this.utilities.precisionRound(tradeFee, 8);
		let sum = quantity * rate;
		if(tradeType.toLowerCase() === 'buy'){
			return sum + tradeFee;
		}
		else if(tradeType.toLowerCase() === 'sell'){
			return sum - tradeFee;
		}
	}
	
	isSufficientFundsTwoTrades(){
		return this.determineEnoughFundsTwoTrades(this.middleware.marketBalances.getBalances());
	}
	
	isSufficientFundsThreeTrades(){
		return this.determineEnoughFundsThreeTrades(this.middleware.marketBalances.getBalances());
	}
	
	reCalculateTrade(){
		return this.determineLeastFundsAvailable(this.middleware.marketBalances.getBalances());
	}
	
	determineEnoughFundsTwoTrades(balance){
		if(!balance){
			throw new TypeError("Program could not grab your Balances and has crashed");
		}
		if(!balance[this.currencies[1]] || !balance[this.currencies[2]]){
			return false;
		}
		return (balance[this.currencies[1]].coins >=  this.completedTrade2.quantity ) && //Enough for Trade 3
			(balance[this.currencies[2]].coins >= this.utilities.precisionRound(this.computeTrade(this.completedTrade2.quantity, this.completedTrade2.rate, this.middleware.marketFee, 'buy'), 8)); //Enough for Trade 2
	}
	
	determineEnoughFundsThreeTrades(balance){
		if(!balance){
			throw new TypeError("Program could not grab your Balances and has crashed");
		}
		if(!balance[this.currencies[0]] || !balance[this.currencies[1]] || !balance[this.currencies[2]]){
			return false;
		}
		return (balance[this.currencies[0]].coins >= this.completedTrade1.quantity) &&  //Enough for trade 1.
		(balance[this.currencies[1]].coins >=  this.completedTrade2.quantity ) && //Enough for Trade 3.
			(balance[this.currencies[2]].coins >= this.utilities.precisionRound(this.computeTrade(this.completedTrade2.quantity, this.completedTrade2.rate, this.middleware.marketFee, 'buy'), 8)); //Enough for Trade 2
	}
	
	determineLeastFundsAvailable(balance){
		if(!balance){
			throw new TypeError("Program could not grab your Balances and has crashed");
		}
		let balanceTrade1 = balance[this.currencies[0]] ? balance[this.currencies[0]].coins / this.completedTrade1.quantity : 1; //Trade 1
		let balanceTrade3 =  balance[this.currencies[1]] ? (balance[this.currencies[1]].coins /  this.completedTrade2.quantity ) : 1; // Trade 3
		let balanceTrade2 =  balance[this.currencies[2]] ? (balance[this.currencies[2]].coins / this.utilities.precisionRound(this.computeTrade(this.completedTrade2.quantity, this.completedTrade2.rate, this.middleware.marketFee, 'buy'), 8)) : 1; //Enough for Trade 2
		
		let lowest = Math.min(balanceTrade1, balanceTrade2, balanceTrade3);
		let obj = {
		};
		
		if(lowest > 1){
			obj['currency'] = this.currencies[0];
			obj['lowest'] = 1;
			return obj;
		}
		
		if(lowest === balanceTrade1){
			obj['currency'] = this.currencies[0];
		}
		else if(lowest === balanceTrade3){
			obj['currency'] = this.currencies[1];
		}
		else if(lowest === balanceTrade2){
			obj['currency'] = this.currencies[2];
		}
		obj['lowest'] = this.utilities.precisionFloor(lowest, 5);
		return obj;
	}
	
	isStatusOk(){
		return this.isAllStatusOk(this.middleware.marketBalances.getBalances());
	}
	
	isAllStatusOk(balance){
		if(!balance){
			throw new TypeError("Program could not grab your Balances and has crashed");
		}
		if(!balance[this.currencies[0]]){
			return (balance[this.currencies[1]].status.toLowerCase() === "ok") &&  (balance[this.currencies[2]].status.toLowerCase() === "ok");
		}
		return (balance[this.currencies[1]].status.toLowerCase() === "ok") &&  (balance[this.currencies[2]].status.toLowerCase() === "ok")
			&& (balance[this.currencies[0]].status.toLowerCase() === "ok");
	}
}