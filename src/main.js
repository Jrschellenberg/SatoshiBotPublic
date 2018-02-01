require("babel-polyfill"); //This should go first
import SatoshiTrader from "./controller/satoshiTrader";

//Initializing Robots To Trade

//Entry Point into Program.
let currencies = ["BTC", "LTC", "GRLC"];

new SatoshiTrader(currencies);

//new SatoshiTrader(currencies);


