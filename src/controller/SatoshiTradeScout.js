export default class SatoshiTradeScout {
		static numberOfSlaves;
		static marketPairings;
		static mappedMarketPairings;
		
	static createInstance(numberOfSlaves, marketPairings){
		SatoshiTradeScout.numberOfSlaves = numberOfSlaves;
		SatoshiTradeScout.marketPairings = marketPairings;
		SatoshiTradeScout.mappedMarketPairings = [[]];
		SatoshiTradeScout.slaveIndexs = [];
		for(let i=0; i<numberOfSlaves; i++){ // May need -1
			SatoshiTradeScout.slaveIndexs[i] = 0 //Initialize all of the indexes at 0
			SatoshiTradeScout.mappedMarketPairings[i] = []; //Initialize these as empty arrays to work with later.
			//console.log(i);
		}
		
		for(let i=0; i<marketPairings.length; i++){ //Loop through all pairings.
			let j =  i%numberOfSlaves; //Match our pairings to slaves work Ticket
			//console.log(marketPairings[i]);
			//console.log(j);
			SatoshiTradeScout.mappedMarketPairings[j].push(marketPairings[i]);
		}
	
	}
	
	static getWork(slaveNumber){
		if(SatoshiTradeScout.slaveIndexs[slaveNumber] == SatoshiTradeScout.mappedMarketPairings[slaveNumber].length){
			SatoshiTradeScout.slaveIndexs[slaveNumber] = 0;
			console.log("Is it hitting this?!?");
			return SatoshiTradeScout.mappedMarketPairings[slaveNumber][SatoshiTradeScout.slaveIndexs[slaveNumber]]; // I think it errroring here!!!!!
		}
		
		let index = SatoshiTradeScout.slaveIndexs[slaveNumber];
		console.log(index);
		console.log(SatoshiTradeScout.mappedMarketPairings[slaveNumber].length);
		
		//console.log(SatoshiTradeScout.mappedMarketPairings[slaveNumber][++SatoshiTradeScout.slaveIndexs[slaveNumber]]);
		return SatoshiTradeScout.mappedMarketPairings[slaveNumber][++SatoshiTradeScout.slaveIndexs[slaveNumber]]; //Increment index by 1 and send off work.
	}
}