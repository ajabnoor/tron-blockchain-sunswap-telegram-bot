//imports
import express from 'express';
import { TronWeb } from 'tronweb';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

//tronweb variables
const privateKey = process.env.PRIVATE_KEY
const apiKey = '65a896e1-1da8-459b-80b0-cf0ac3a2e786'

var tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io",
    headers: { "TRON-PRO-API-KEY": apiKey },
    privateKey: privateKey,
});

//express variables
const app = express()
const port = process.env.PORT || 3000;

//Telegrambot variables
// replace the value below with the Telegram token you receive from @BotFather
// const token = '7553876036:AAG4rh8cmjYRIgg3LweIwJTFB5tuTjusAmI';
const token = '7720868534:AAH0-HyKs8S0H1NknM-xNTdJn5nhtwRzu_s';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// const chatId = '@Bitcoin_Meter';
const chatId = '@theRevolt_GoT';
const opts = {parse_mode: 'Markdown', disable_web_page_preview: true};
var minutes = 1440;
var the_interval = minutes * 60 * 1000;
var sunswap_url = 'https://sun.io/?lang=en-US#/v3/swap?t1=T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb&t0=TKKkXMr7uuZ5kdajTcTqz9YNhAfNZnr7wm&type=swap';
var dextools_url = 'https://www.dextools.io/app/en/tron/pair-explorer/TRzE68tbBoy2Ec5vLTLzQEPCUXktu4bB6D';
var pool_desc_url = 'https://t.me/theRevolt_GoT/36453';

let abi = [
    {
        "outputs": [
            {
                "name": "sqrtPriceX96",
                "internalType": "uint160",
                "type": "uint160"
            },
            {
                "name": "tick",
                "internalType": "int24",
                "type": "int24"
            },
            {
                "name": "observationIndex",
                "internalType": "uint16",
                "type": "uint16"
            },
            {
                "name": "observationCardinality",
                "internalType": "uint16",
                "type": "uint16"
            },
            {
                "name": "observationCardinalityNext",
                "internalType": "uint16",
                "type": "uint16"
            },
            {
                "name": "feeProtocol",
                "internalType": "uint8",
                "type": "uint8"
            },
            {
                "name": "unlocked",
                "internalType": "bool",
                "type": "bool"
            }
        ],
        "inputs": [],
        "name": "slot0",
        "stateMutability": "view",
        "type": "function"
    },

];

// price calculations functions 
const roundToMillionth = (value) => {
    return Number(value.toFixed(7));
};

const tickToPrice = (tick, tokenDecimals0, tokenDecimals1) => {
    const ratio = (1.0001 ** Number(tick));
    const decimalShift = 10 ** (Number(tokenDecimals0) - Number(tokenDecimals1));
    return ratio * decimalShift;
}

app.get('/ping', (req, res) => {
    res.send('sucess response')
    console.log('keep it running')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

//interval for pushing telegram messages
setInterval(function() {
    mainPost();
}, the_interval);

//keep server running
setInterval(function() {
axios.get(`http://localhost:${port}/ping`).catch((err) => console.log(err));
}, 1000 * 60 * 5);

async function mainPost() {

    tronWeb.setAddress('TEe5MgWnhEEEoMUrRBsAovSJnDK4QQivBe');

    // read trc20 account balance
    let contract = await tronWeb.contract(abi, 'TRzE68tbBoy2Ec5vLTLzQEPCUXktu4bB6D');
    // let contract = await tronWeb.contract().at("TRzE68tbBoy2Ec5vLTLzQEPCUXktu4bB6D");
    let data = await contract.slot0().call();

    // let result = await contract.getPool('TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR','TKKkXMr7uuZ5kdajTcTqz9YNhAfNZnr7wm',3000).call()
    // let result = await contract.owner().call()

    const rev_trx_price = roundToMillionth(tickToPrice(data.tick, 2, 6));
    const trx_rev_price = Math.round(1 / rev_trx_price);

    // console.log(roundToMillionth(price))

    console.log(rev_trx_price)
    console.log(trx_rev_price)
    let msg = `*Current REV Price: * \n\n1 TRX = ${trx_rev_price} REV
    \n================\n\n*Buy REV now from* [SunSwap](${sunswap_url})
    \n================\n\n*Check REV Chart in* [DexTools](${dextools_url})
    \n================\n\n*How TRX/REV pool works?* [Read Here](${pool_desc_url})
    \n================\n\n*The Revolt Website:* therevolt.io`;

    bot.sendMessage(chatId, msg, opts);
}

async function miniPost() {
    tronWeb.setAddress('TEe5MgWnhEEEoMUrRBsAovSJnDK4QQivBe');

    let contract = await tronWeb.contract(abi, 'TRzE68tbBoy2Ec5vLTLzQEPCUXktu4bB6D');
    let data = await contract.slot0().call();

    const rev_trx_price = roundToMillionth(tickToPrice(data.tick, 2, 6));
    const trx_rev_price = Math.round(1 / rev_trx_price);

    console.log('user hit price')

    let msg = `*Current REV Price: * \n\n1 TRX = ${trx_rev_price} REV`;
    bot.sendMessage(chatId, msg, opts);
}

bot.onText(/\/price/, () => {

    miniPost();
    
    });