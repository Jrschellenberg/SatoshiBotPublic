# SatoshiBot

A project created to trade cryptocurrencies on exchanges using REST API end points and Node.js. 
I had written a trade strategy algorithm to compare buy/sell prices on three markets and when profitable, conduct three asynchronous trades on the markets to make a small profit.

# NOTICE
- I don't expect anyone to actually use this project as I did it for fun and with the intention of improving my coding skills. I never got around to creating a user Interface for this project and have become occupied with other projects currently. I may in the future come back and upgrade this project but for now I just don't have the time.
- I am Posting this project so people may have access to the Node based implementations of the cryptopia and Trade Satoshi API's.

- When I initially started this project, one of the biggest hurdles for myself was figuring out Trade Satoshis private API since it is poorly documented and requires a SHA512 based hash signature with a nonce and HMAC.
With that being said, However, Heed warning to the following two points:
  - TradeSatoshis Server Side API is very very poorly implemented. Any error it has returns a 500 Internal Server error with the message of "Service Currently Unavailable"
  - The Node.js interface I implemented for TradeSatoshi was created by using an implementation someone made for Cryptopia. I never used every method in Trade Satoshi's API and re wrote it as I required them for use cases, therefore, not all of Trade Satoshis API calls may be ported over.



## Prerequistites
- This project requires you to have an API KEY / Secret Generated. Code base works with [TradeSatoshi](https://tradesatoshi.com) as well as [Cryptopia](https://www.cryptopia.co.nz/)
- The account MUST have minimum of 10 USD in the following cryptocurrencies, USDT, BTC, (NZDT if cryptopia), (LTC, DOGE, BCH if trade satoshi)

 
## Installation
- Clone the project
-  Visit [Here](https://github.com/Jrschellenberg/SatoshiBot/blob/master/src/service/secretHere.js) and fill in the keys appropriately from prerequesites.
- run ``npm install``
- run ``npm start``
