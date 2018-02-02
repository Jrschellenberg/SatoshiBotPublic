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

async function scrapeMarkets() {
	//console.log(SatoshiTrader.getBalances());
	let writeData = 'let marketPairings = [\n';
	let currenciesArray = targetMarkets;
	console.log(currenciesArray.length);
	for (let i = 0; i < currenciesArray.length; i++) {
		for (let j = i + 1; j < currenciesArray.length; j++) {
			for (let k = j + 1; k < currenciesArray.length; k++) {
				//console.log("got in her?");
				//console.log(k);
				writeData += await '["' + currenciesArray[i] + '", "' + currenciesArray[j] + '", "' + currenciesArray[k] + '"],\n';
			}
		}
	}
	console.log("finished writeDATA");
	writeData = await writeData.slice(0, -1);
	writeData = await writeData.slice(0, -1);
	writeData += await '];';
	
	
	fs.writeFileSync('./markets.js', writeData);
	
}