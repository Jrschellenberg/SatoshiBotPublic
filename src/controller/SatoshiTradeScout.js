export default class SatoshiTradeScout {
		static numberOfSlaves;
		static marketPairings;
		static mappedMarketPairings;
		
	static createInstance(numberOfSlaves, marketPairings){
		SatoshiTradeScout.numberOfSlaves = numberOfSlaves;
		SatoshiTradeScout.marketPairings = marketPairings;
		SatoshiTradeScout.mappedMarketPairings = [];
		SatoshiTradeScout.slaveIndexs = [];
		
		for(let i=0; i<marketPairings.length; i++){ //Loop through all pairings.
			let j = i%numberOfSlaves; //Match our pairings to slaves work Ticket
			SatoshiTradeScout.mappedMarketPairings[j].push(marketPairings[i]);
		}
		for(let i=0; i<numberOfSlaves; i++){ // May need -1
			SatoshiTradeScout.slaveIndexs[i] = 0 //Initialize all of the indexes at 0
		}
	}
	
	static getWork(slaveNumber){
		if(SatoshiTradeScout.slaveIndexs[slaveNumber] == SatoshiTradeScout.mappedMarketPairings[slaveNumber].length){
			SatoshiTradeScout.slaveIndexs[slaveNumber] = 0;
			return SatoshiTradeScout.mappedMarketPairings[slaveNumber][SatoshiTradeScout.slaveIndexs[slaveNumber]];
		}
		return SatoshiTradeScout.mappedMarketPairings[slaveNumber][++SatoshiTradeScout.slaveIndexs[slaveNumber]]; //Increment index by 1 and send off work.
	}
}