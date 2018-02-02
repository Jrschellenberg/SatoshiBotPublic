export default class TradeSatoshiCurrencies {
		static balance = {};
		
	static async getAccountBalance() {
		return await TradeSatoshiCurrencies.balance;
	}
	
	static async setAccountBalance(coins) {
		for(let i=0; i<coins.length; i++){
			if(coins[i].total != 0){
				let key = coins[i].currency;
				TradeSatoshiCurrencies.balance[key] = coins[i].total;
			}
		}
	}
}