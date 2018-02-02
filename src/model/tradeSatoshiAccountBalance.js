

class TradeSatoshiCurrencies {
		static balance = [];
	
	static getAccountBalance() {
		return TradeSatoshiCurrencies.balance;
	}
	
	static async setAccountBalance(coins) {
		for(let i=0; i<coins.length; i++){
			TradeSatoshiCurrencies.balance.push(coins[i]);
		}
		console.log(TradeSatoshiCurrencies.balance);
	}
}




export default TradeSatoshiCurrencies;