const crypto = require('crypto');
const request = require('requestretry');
const async = require('async');

const HOST_URL = "https://tradesatoshi.com/api";

let TradeSatoshi = () => {
    let options = {
        API_KEY: null,
        API_SECRET: null,
        HOST_URL: HOST_URL,
        API_PATH: null
    };

    //HTTPS Private Request
    async function privateRequest(params) {
	    let reqOpts = {
		    url: options.HOST_URL + "/private/" + options.API_PATH,
		    headers: {
			    'Authorization': buildAuth(params, options),
			    'Content-Type': 'application/json; charset=utf-8'
		    },
		    body: JSON.stringify(params),
        maxAttempts: 10,
        retryDelay: 3000
	    };
	    //Need to put in retries here.....
        try {
            let response = await request.post(reqOpts);
            //console.log(response);
	          response = JSON.parse(response.body);
            return response.success ? Promise.resolve(response.result) : Promise.reject(response.message);
          
        } catch (err) {
            return Promise.reject('privateRequest(), Error on privateRequest: ' + err)
        }
    }

    //HTTPS Public Request
    async function publicRequest(urlParams) {
	    let reqOpts = {
		    url: urlParams ? options.HOST_URL + "/public/" + options.API_PATH+"?"+urlParams : options.HOST_URL + "/public/" + options.API_PATH,
		    headers: {
			    'Content-Type': 'application/json; charset=utf-8'
		    },
		    json: true,
        maxAttempts: 50,
        retryDelay: 500
	    };
	    //And here...
        try {
            let response = await request.get(reqOpts);
           // console.log(response);
            response = response.body;
            //console.log(response);
            return response.success ? response.result : Promise.reject(response.message);
        } catch (err) {
           // console.log(err);
            return Promise.reject('publicRequest(), Error on publicRequest: ' + err)
        }
    }

    //Authorization Builder
    function buildAuth(params, opts) {
        let nonce = crypto.randomBytes(64).toString('hex');
        // let md5 = crypto.createHash('md5').update(JSON.stringify(params)).digest();  //May not need this for trade satoshi.
        // let requestContentBase64String = md5.toString('base64');
        let requestContentBase64String = new Buffer(JSON.stringify(params)).toString('base64');
        let signature = opts.API_KEY + "POST" + encodeURIComponent(opts.HOST_URL + "/private/" + opts.API_PATH).toLowerCase() + nonce + requestContentBase64String;
        let hmacsignature = crypto.createHmac('sha512', new Buffer(opts.API_SECRET, "base64")).update(signature).digest().toString('base64');
        return "amx " + opts.API_KEY + ":" + hmacsignature + ":" + nonce;
    }
    
    function buildURL(params){
          let ret = [];
          for (let p in params)
            ret.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));
          return ret.join('&');
    }

    //Client Functions
    return {
	    /*
			=========================================Private APIs=============================================================
			==================================================================================================================
			 */
        getBalance: async (params = {}) => {
            if(!params.currency){
	            return Promise.reject("getBalance(), You must supply a valid Currency, e.g. 'BTC'");
            }
            options.API_PATH = "getbalance";
            return privateRequest(params);
        },
        getBalances: async (params = {}) => {
            options.API_PATH = "getbalances";
            return privateRequest(params);
        },
        getOrder: async (params = {}) => {
            if (!params.orderId) {
                return Promise.reject("getOrder(), You must supply a valid OrderId, e.g. '100'");
            }
            options.API_PATH = "getorder";
            return privateRequest(params);
        },
        getOrders: async (params = {}) => {
            options.API_PATH = "getorders";
            return privateRequest(params);
        },
        submitOrder: async (params = {}) => {
            if (!params.market) {
                return Promise.reject("submitOrder(), You must supply a valid market or trade pair Id!");
            } else if (params.type && params.type !== 'Buy' && params.type !== 'Sel') {
                return Promise.reject("submitOrder(), You must supply a valid Type, e.g. 'Sell' or 'Buy'!");
            }  else if (!params.amount || typeof params.amount !== 'number') {
	              return Promise.reject("submitOrder(), You must supply a valid Amount, e.g. Amount: '123.00000000'!");
            }   else if (!params.price || typeof params.price !== 'number' ) {
	              return Promise.reject("submitOrder(), You must supply a valid price, e.g. price: '0.00000034'");
            }
            options.API_PATH = "submitorder";
            return privateRequest(params);
        },
        cancelOrder: async (params = {}) => {
            console.log(params.type);
            if (!params.type || (params.type.toLowerCase() != 'single' && params.type.toLowerCase() != 'market' && params.type.toLowerCase() != 'marketsells'
	            && params.type.toLowerCase() != 'marketbuys' && params.type.toLowerCase() != 'allsells' && params.type.toLowerCase() != 'all')) {
                return Promise.reject("cancelOrder(), You must supply a valid type, e.g. 'Single', 'Market', Etc");
            } else if (params.type.toLowerCase() == 'single' && !params.orderId) {
                return Promise.reject("cancelOrder(), You must supply a valid OrderId when type is selected as 'Single'");
            } else if ((params.type.toLowerCase() == 'market' || params.type.toLowerCase() == 'marketbuys' || params.type.toLowerCase() == 'marketsells' ) && !params.market)  {
                return Promise.reject("cancelOrder(), You must supply a valid Market when type is selected as 'Market', 'MarketBuys', or 'MarketSells'!");
            }
            options.API_PATH = "cancelorder";
            return privateRequest(params);
        },
        getTradeHistory: async (params = {}) => {
            options.API_PATH = "gettradehistory";
            return privateRequest(params);
        },
        generateAddress: async (params = {}) => {
            if(!params.currency){
	            return Promise.reject("generateAddress(), You must supply a valid Currency, e.g. 'BTC'");
            }
	          options.API_PATH = "generateaddress";
	          return privateRequest(params);
        },
      
        submitWithdraw: async (params = {}) => {
            if (!params.currency && typeof params.currency !== 'string') {
                return Promise.reject("submitWithdraw(), You must supply a valid Currency, e.g. 'BTC'");
            }else if (!params.address) {
                return Promise.reject("submitWithdraw(), You must supply a valid Address that exists within your AddressBook!");
            } else if (!params.amount || typeof params.amount !== 'number') {
                return Promise.reject("submitWithdraw(), You must supply a valid Amount, e.g. Amount: '123.00000000'!");
            }
            options.API_PATH = "submitwithdraw";
            return privateRequest(params);
        },
        getDeposits: async (params = {}) => {
	          options.API_PATH = "getdeposits";
	          return privateRequest(params);
        },
        getWithdrawals: async (params = {}) => {
	          options.API_PATH = "getwithdrawals";
	          return privateRequest(params);
        },
      
        submitTransfer: async (params = {}) => {
            if (!params.currency && typeof params.Currency !== 'string') {
                return Promise.reject("submitTransfer(), You must supply a valid Currency, e.g. 'BTC'");
            } else if (!params.userName) {
                return Promise.reject("submitTransfer(), You must supply a valid TradeSatoshi UserName, e.g. 'bigdaddy438'!");
            } else if (!params.amount || typeof params.Amount !== 'number') {
                return Promise.reject("submitTransfer(), You must supply a valid Amount, e.g. Amount: '123.00000000'!");
            }
            options.API_PATH = "submittransfer";
            return privateRequest(params);
        },
      
      /*
      =========================================Public APIs==============================================================
      ==================================================================================================================
       */
        getCurrencies: async () => {
            options.API_PATH = "getcurrencies";
            return publicRequest(null);
        },
        getTicker: async (params = {}) => {
            options.API_PATH = "getticker";           
            let urlParams = buildURL(params);
            return publicRequest(urlParams);
        },
        getMarketHistory: async (params = {}) => {
            if(!params.market){
                return Promise.reject("getMarketHistory(), You must supply a valid market or trade pair Id!");
            }
            options.API_PATH = "getmarkethistory";
	          let urlParams = buildURL(params);
            return publicRequest(urlParams);
        },
        getMarketSummary: async (params = {}) => {
            if(!params.market){
              return Promise.reject("getMarketSummary(), You must supply a valid market or trade pair Id!");
            }
            options.API_PATH = "getmarketsummary";
	          let urlParams = buildURL(params);
	          return publicRequest(urlParams);
        },
        getMarketSummaries: async () => {
            options.API_PATH = "getmarketsummaries";
            return publicRequest(null);
        },
        getOrderBook: async (params = {})  => {
            if (!params.market) {
	            return Promise.reject("getOrderBook(), You must supply a valid Market or Trade Pair Id, e.g. 'BTC_LTC' or '100'!");
            }
            options.API_PATH = "getorderbook";
	          let urlParams = buildURL(params);
            return publicRequest(urlParams);
        },
        //Set Options for API
        setOptions: (opts) => {
            if (opts.API_KEY && opts.API_SECRET) {
                options.API_KEY = opts.API_KEY;
                options.API_SECRET = opts.API_SECRET;
            } else {
                return Promise.reject("setOptions(), You must supply a valid Options object including API_KEY and API_SECRET!");
            }
            if (opts.HOST_URL) {
                options.HOST_URL = opts.HOST_URL;
            }
        }
    }
};


module.exports = exports = TradeSatoshi;
