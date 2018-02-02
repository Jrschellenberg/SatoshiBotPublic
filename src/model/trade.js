

export default class Trade {
	constructor(tradeListing1, tradeListing2, tradeListing3, tradeListing4){
		this.trade1 = tradeListing1;
		this.trade1["usdRate"] = tradeListing1.quantity * tradeListing1.rate;
		
		this.trade2 = tradeListing2;
		this.trade2["usdRate"] = tradeListing2.quantity * tradeListing2.rate;
		
		this.trade3 = tradeListing3;
		this.trade3["usdRate"] = tradeListing3.quantity * tradeListing3.rate * tradeListing2.rate;
		
		this.trade4 = tradeListing4;
		this.trade4["usdRate"] = tradeListing4.quantity * tradeListing4.rate * tradeListing1.rate;
		
		this.lowestPrice = Math.min(this.trade1.usdRate, this.trade2.usdRate, this.trade3.usdRate, this.trade4.usdRate);
	}
	
	updateQuantity(quantity, index){
		if(index === 1){
			this.trade1.quantity = quantity;
		} else if(index === 2){
			this.trade2.quantity = quantity;
		} else if(index === 3){
			this.trade3.quantity = quantity;
		}else if(index === 4){
			this.trade4.quantity = quantity;
		}else{
			console.log("A Fatal error occured while trying to update the Quantities, terminating program to avoid unwanted trade...");
			process.exit(1);
		}
	}
	
	
}