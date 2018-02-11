let instance = null;
export default class Utilities {
	constructor() {
		if(instance) return instance;
		instance = this;
	}
	
	precisionRound(num, precision){
		let factor = Math.pow(10, precision);
		return Math.round(num * factor)/factor;
	};
}