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
	precisionFloor(num, precision){
		let factor = Math.pow(10, precision);
		return Math.floor(num * factor)/factor;
	}
	
	isEmptyObject(obj){
		for (var key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				return false;
			}
		}
		return true;
	}
}