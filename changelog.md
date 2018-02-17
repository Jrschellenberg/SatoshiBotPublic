# Changelog
All notable changes to this project will be documented in this file.



## [0.2.0] - 2018-02-17

### Added
- TradeSatoshi Middleware
- Tests for TradeSatoshi middleware

### Changed
- refactored Tradeseeker logicflow
- Added code to set variables to null after Trade has been seeked, to work out bug that occurs.

## [0.1.0] - 2018-02-15
### Added
- Method IsValidAPI for handling bad API calls that were causing bug.
- Added this Changelog

### Changed
- Changed Algorithm to post sell and buy slightly below and above to avoid hanging open trades
- Changed unit tests to reflect core algorithm changes.

### Removed


## [0.0.1] - 2018-02-15
### Added
- Dependencies required for project in package.json file
- algorithm for calculating profitable trades & trade strategy in trade.js
- logicflow for seeking trades in tradeSeeker.js
- logic for distributing trades for tradeSeekers in tradeScout.js
- logic for handling a profitable trade in tradeMaster.js
- Model to store information in tradeListing.js
- Interface(middleware) for cryptopia api in cryptopiaMidddleware.js
- parent class tradeMiddleware to keep commonalities of middelwares.
- service cryptopiaAPI.js to communicate with cryptopia trademarket.
- service satoshiAPI.js to communiate with satoshi trademarket.
- targetMarkets.js to map 1D array of listings into a 2D array of markets to search.
- Unit Tests using mocha and chai for testing code
- code coverage for human friendly file of code coverage

### Changed

### Removed 

## [Unreleased]