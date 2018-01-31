require("babel-polyfill");
const TradeSatoshi = require('./index')();
import {API_CREDENTIALS} from "./secret";
const options = {
    API_KEY: API_CREDENTIALS.KEY,
    API_SECRET: API_CREDENTIALS.SECRET
};
TradeSatoshi .setOptions(options);

(async function () {
    try {
        //Public
        // const currencies = await TradeSatoshi.getCurrencies();
        // console.log(currencies); //Array of available Currencies from API
        //
        // const tradePairs = await TradeSatoshi.getTradePairs();
        // console.log(tradePairs); //Array of available Trade Pairs from API
        //
        // const markets = await TradeSatoshi.getTicker({market: 'LTC_BTC'});
        // console.log(markets); //Array of Markets for 24hrs OR specific Market within 1-24 Hours from API
        //
        // const markets = await TradeSatoshi.getMarketHistory({market: 'LTC_BTC', count: 4});
        // console.log(markets); //Array of Markets for 24hrs OR specific Market within 1-24 Hours from API
        //
        // const market = await TradeSatoshi.getMarketSummary({market: 'LTC_BTC'});
        // console.log(market); //Array of a specific Market's data for 24hrs OR within 1-24 Hours from API
        //
        // const marketHistory = await TradeSatoshi.getMarketSummaries();
        // console.log(marketHistory); //Array of a specific Market's data for 24hrs OR within 1-168 (7 days) Hours from API
        //
        // const marketOrders = await TradeSatoshi.getOrderBook({market: 'LTC_BTC'});
        // console.log(marketOrders); //Object with 'Buy' and 'Sell' as arrays with specified Count limit from API
        //

        // Private
        const balance = await TradeSatoshi.getBalance({currency: 'BTC'});
        console.log(balance); //Array of available Balances from API

        // const depositAddress = await TradeSatoshi.getBalances();
        // console.log(depositAddress); //Object with Deposit Address data from API

        // const tradeHistory = await TradeSatoshi.getOrder({orderId: '9619369'});
        // console.log(tradeHistory); //Array of available Trade History for Market from API
        //
        // const transactions = await TradeSatoshi.getOrders();
        // console.log(transactions); //Array of available Transactions with Type from API
        //
        // const openOrders = await TradeSatoshi.getOpenOrders({Market: 'ETH/BTC', Count: 10});
        // console.log(openOrders); //Array of available Open Orders in Market from API
        //
        // const submitTrade = await TradeSatoshi.submitTrade({Market: 'ETH/BTC', Type: 'Buy', Rate: 0.00050000, Amount: 123.000000000});
        // console.log(submitTrade); //Object with OrderId and FilledOrders array from API
        //
        // const cancelTrade = await TradeSatoshi.cancelTrade({Type: 'Trade', OrderId: 12354});
        // console.log(cancelTrade); //Array of Cancelled OrderIds from API
        //
        // const submitTip = await TradeSatoshi.submitTip({Currency: 'LTC', ActiveUsers: 23, Amount: 123.000000000});
        // console.log(submitTip); //String with results of the Tip request from API
        //
        // const submitWithdraw = await TradeSatoshi.submitWithdraw({Currency: 'DOGE', Address: 'Inset TradeSatoshi  Address!', PaymentId: 'Monies4U-12345-78', Amount: 123.000000000});
        // console.log(submitWithdraw); //Integer as the OrderId from API
        //
        // const submitTransfer = await TradeSatoshi.submitTransfer({Currency: 'DOGE', UserName: 'bigdaddy234', Amount: 123.000000000});
        // console.log(submitTransfer); //String with results of the Transfer from API
    } catch (err) {
        console.error(err);
    }
})();
