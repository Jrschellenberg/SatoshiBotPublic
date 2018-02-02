

class TradeSatoshiCurrencies {
		static balance = [];
	
	static async getAccountBalance() {
		return await TradeSatoshiCurrencies.balance;
	}
	
	static async setAccountBalance(coins) {
		for(let i=0; i<coins.length; i++){
			await TradeSatoshiCurrencies.balance.push(coins[i]);
		}
		//console.log(TradeSatoshiCurrencies.balance);
	}
}




export default TradeSatoshiCurrencies;