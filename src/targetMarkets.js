let fs = require('fs');

let targetMarkets = [
	'1337',
	'808',
	'ATOM',
	'BCC',
	'BCH',
	'BLK',
	'BOLI',
	'BOSS',
	'BTC',
	'BTCD',
	'BTCS',
	'BTCZ',
	'DASH',
	'LTC',
	'ZEC',
	'ZEN',
	'STRAT',
	'GRLC',
	'XVG',
	'HSR',
	'DGB',
	'ZCL',
	'ONION',
	'BTM',
	'XZC',
	'MONA',
	'RDD',
	'EMC2',
	'SFI',
	'XP'
];

function scrapeMarkets() {
	//console.log(SatoshiTrader.getBalances());
	let writeData = 'let marketPairings = [\n';
	let currenciesArray = targetMarkets;
	for (let i = 0; i < currenciesArray.length; i++) {
		for (let j = i + 1; j < currenciesArray.length; j++) {
			for (let k = j + 1; k < currenciesArray.length; k++) {
				//console.log("got in her?");
				//console.log(k);
				writeData +=  '["' + currenciesArray[i] + '", "' + currenciesArray[j] + '", "' + currenciesArray[k] + '"],\n';
			}
		}
	}
	//console.log("finished writeDATA");
	writeData =  writeData.slice(0, -1);
	writeData =  writeData.slice(0, -1);
	writeData +=  '];\n export {marketPairings}';
	
	
	fs.writeFileSync('./src/markets.js', writeData);
	
}
scrapeMarkets();