export default class TradeSatoshiCurrencies {
		static balance = [];
		
	static async getAccountBalance() {
		return await TradeSatoshiCurrencies.balance;
	}
	
	static async setAccountBalance(coins) {
		TradeSatoshiCurrencies.balance = coins;
	}
}