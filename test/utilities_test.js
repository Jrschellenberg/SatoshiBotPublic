import Utilities from '../src/utilities';

const expect = require('chai').expect;
let utilities = new Utilities();

describe('Utilities - PrecisionRound', () => {
	if('should return NaN if supplied with non integer arguments', ()=> {
			expect(utilities.precisionRound('stringOne', 0.12312312312)).to.be.NaN;
			expect(utilities.precisionRound(0.123, 'stringTwo')).to.be.NaN;
			expect(utilities.precisionRound(null, 'stringTwo')).to.be.NaN;
			expect(utilities.precisionRound(12.23, 'stringTwo')).to.be.NaN;
			expect(utilities.precisionRound(12.23, 'stringTwo')).to.be.NaN;
		});
	
	it('should return 0 if supplied with null arguments', () => {
		expect(utilities.precisionRound(null, null)).to.be.equal(0);
	});
	
	it('should return 0 if first  argument is null', () => {
		expect(utilities.precisionRound(null, 10)).to.be.equal(0);
	});
	it('should round to nearest decimal place if second argument is null', ()=>{
		expect(utilities.precisionRound(10.12, null)).to.be.equal(10);
		expect(utilities.precisionRound(10.62, null)).to.be.equal(11);
	});
	
	it('should return a first argument rounded to number decimal places specified by second argument', () => {
		expect(utilities.precisionRound(20.1234532, 2)).to.be.equal(20.12);
		expect(utilities.precisionRound(20.1274532, 2)).to.be.equal(20.13);
		expect(utilities.precisionRound(20.1274532234235, 8)).to.be.equal(20.12745322);
	});
});

describe('Utilities - PrecisionFloor', () => {
	it('should return the first argument with decimals always rounded down in place specified by second argument', () => {
		expect(utilities.precisionFloor(20.123456789, 5)).to.be.equal(20.12345);
		expect(utilities.precisionFloor(20.1, 5)).to.be.equal(20.1);
	});
});