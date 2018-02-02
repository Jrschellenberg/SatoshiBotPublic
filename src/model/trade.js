

export default class Trade {
	constructor(tradeListing1, tradeListing2, tradeListing3, tradeListing4, currencies){
		this.trade1 = tradeListing1;
		this.trade1["usdRate"] = tradeListing1.quantity * tradeListing1.rate;
		
		this.trade2 = tradeListing2;
		this.trade2["usdRate"] = tradeListing2.quantity * tradeListing2.rate;
		
		this.trade3 = tradeListing3;
		this.trade3["usdRate"] = tradeListing3.quantity * tradeListing3.rate * tradeListing2.rate;
		
		this.trade4 = tradeListing4;
		this.trade4["usdRate"] = tradeListing4.quantity * tradeListing4.rate * tradeListing1.rate;
		
		this.lowestPrice = Math.min(this.trade1.usdRate, this.trade2.usdRate, this.trade3.usdRate, this.trade4.usdRate);
		this.currencies = currencies;
	}
	
	updateQuantities(){
		this.trade1.quantity = (this.lowestPrice / this.trade1.usdRate) * this.trade1.quantity;
		this.trade2.quantity = (this.lowestPrice / this.trade2.usdRate) * this.trade2.quantity;
		
		this.trade3.quantity = (this.lowestPrice / this.trade3.usdRate) * this.trade3.quantity;
		this.trade4.quantity = (this.lowestPrice / this.trade4.usdRate) * this.trade4.quantity;
	}
	
	isBelowMinimum(){
		if(this.trade1.usdRate < 0.05 || this.trade2.usdRate < 0.05 || this.trade3.usdRate < 0.05 || this.trade4.usdRate < 0.05){
			return true;
		}
		return false;
	}
	
	async isAccountEmpty(){
		let balance = await SatoshiTrader.getBalances();
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