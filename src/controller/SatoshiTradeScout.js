

export default class SatoshiTradeScout {
		constructor(numberOfSlaves,marketPairings){
			this.numberOfSlaves = numberOfSlaves;
			this.marketPairings = marketPairings;
			this.mappedMarketPairings = [[]];
			this.slaveIndexs = [];
			for(let i=0; i<numberOfSlaves; i++){ // May need -1
				this.slaveIndexs[i] = 0 //Initialize all of the indexes at 0
				this.mappedMarketPairings[i] = []; //Initialize these as empty arrays to work with later.
				//console.log(i);
			}
			
			for(let i=0; i<marketPairings.length; i++){ //Loop through all pairings.
				let j =  i%numberOfSlaves; //Match our pairings to slaves work Ticket
				//console.log(marketPairings[i]);
				//console.log(j);
				this.mappedMarketPairings[j].push(marketPairings[i]);
			}
			
		}
	
	getWork(slaveNumber){
		if(this.slaveIndexs[slaveNumber] === this.mappedMarketPairings[slaveNumber].length){
			this.slaveIndexs[slaveNumber] = 0;
			return this.mappedMarketPairings[slaveNumber][this.slaveIndexs[slaveNumber]++]; // I think it errroring here!!!!!
		}
		return this.mappedMarketPairings[slaveNumber][this.slaveIndexs[slaveNumber]++]; //Increment index by 1 and send off work.
	}
}