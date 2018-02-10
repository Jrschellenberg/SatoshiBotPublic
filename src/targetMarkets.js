let fs = require('fs');

let targetMarketsSatoshi = [
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


let targetMarketsCryptopia = [
	'USDT',
	'BTC',
	'ETH',
	'ETN',
	'LTC',
	'XVG',
	'LUX',
	'XMR',
	'ETC',
	'BCH',
	'NZDT',
	'DOGE',
	'HUSH',
	'DASH',
	'ZEC',
	'UNO',
	'ORME',
	'BTX',
	'SKY',
	'CEFS',
	'DCR',
	'NAV',
	'DOT',
	'ARK',
	'BSD'
];

function scrapeMarkets(array, filename, market) {
	//console.log(SatoshiTrader.getBalances());
	let writeData = 'let '+filename+' = [\n';
	let currenciesArray = array;
	for (let i = 0; i < currenciesArray.length; i++) {
		for (let j = 0; j < currenciesArray.length; j++) {
			for (let k = 0; k < currenciesArray.length; k++) {
				//console.log("got in her?");
				//console.log(k);
				if(isMainMarket(i, j, k, currenciesArray, market) && isNoRepeat(i,j,k,currenciesArray)) {
					//console.log(i);
					writeData += '["' + currenciesArray[i] + '", "' + currenciesArray[j] + '", "' + currenciesArray[k] + '"],\n';
				}
			}
		}
	}
	//console.log("finished writeDATA");
	writeData =  writeData.slice(0, -1);
	writeData =  writeData.slice(0, -1);
	writeData +=  '];\n export {'+filename+'}';
	
	
	fs.writeFileSync('./src/'+filename+'.js', writeData);
	
}
function isMainMarket(i, j, k, arr, market){
	if((market.toLowerCase() === 'satoshi') &&
		(arr[i].toLowerCase() === "btc" || arr[i].toLowerCase() ==="ltc" || arr[i].toLowerCase() ==="doge" || arr[i].toLowerCase() ==="bch")
	&& (arr[j].toLowerCase() ==="btc" || arr[j].toLowerCase() ==="ltc" || arr[j].toLowerCase() ==="doge" || arr[j].toLowerCase() ==="bch")){
		//console.log(arr[i]);
		return true;
	}
	else if((market.toLowerCase() === 'cryptopia')  && (arr[i].toLowerCase() !== 'usdt') &&
		(arr[j].toLowerCase() ==="btc"  || arr[j].toLowerCase() ==="nzdt")
		&& (arr[k].toLowerCase() === "usdt" || arr[k].toLowerCase() ==="btc"  || arr[k].toLowerCase() ==="nzdt" )){
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

scrapeMarkets(targetMarketsSatoshi, 'satoshiMarkets', 'satoshi');
scrapeMarkets(targetMarketsCryptopia, 'cryptopiaMarkets', 'cryptopia');
