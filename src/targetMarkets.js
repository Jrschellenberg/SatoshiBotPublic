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
	'DOGE',
	'XP'
];

function scrapeMarkets() {
	//console.log(SatoshiTrader.getBalances());
	let writeData = 'let marketPairings = [\n';
	let currenciesArray = targetMarkets;
	for (let i = 0; i < currenciesArray.length; i++) {
		for (let j = 0; j < currenciesArray.length; j++) {
			for (let k = 0; k < currenciesArray.length; k++) {
				//console.log("got in her?");
				//console.log(k);
				if(isMainMarket(i, j, currenciesArray) && isNoRepeat(i,j,k,currenciesArray)) {
					//console.log(i);
					writeData += '["' + currenciesArray[i] + '", "' + currenciesArray[j] + '", "' + currenciesArray[k] + '"],\n';
				}
			}
		}
	}
	//console.log("finished writeDATA");
	writeData =  writeData.slice(0, -1);
	writeData =  writeData.slice(0, -1);
	writeData +=  '];\n export {marketPairings}';
	
	
	fs.writeFileSync('./src/markets.js', writeData);
	
}
function isMainMarket(i, j, arr){
	if((arr[i].toLowerCase() === "btc" || arr[i].toLowerCase() ==="ltc" || arr[i].toLowerCase() ==="doge" || arr[i].toLowerCase() ==="bch")
	&& (arr[j].toLowerCase() ==="btc" || arr[j].toLowerCase() ==="ltc" || arr[j].toLowerCase() ==="doge" || arr[j].toLowerCase() ==="bch")){
		//console.log(arr[i]);
		return true;
	}
	return false;
}
function isNoRepeat(i, j, k, arr){
	if((arr[i].toLowerCase() !== arr[j].toLowerCase()) 
		&& (arr[i].toLowerCase() !== arr[k].toLowerCase())
		&& arr[j].toLowerCase() !== arr[k].toLowerCase()){
		return true;
	}
	return false;
}

scrapeMarkets();