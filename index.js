import { TronWeb } from 'tronweb';
const privateKey = process.env.PRIVATE_KEY
const apiKey = '65a896e1-1da8-459b-80b0-cf0ac3a2e786'

var tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io",
    headers: { "TRON-PRO-API-KEY": apiKey },
    privateKey: privateKey,
});

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

const roundToMillionth = (value) => {
    return Number(value.toFixed(7));
  };

  const tickToPrice = (tick, tokenDecimals0, tokenDecimals1) => {
    const ratio = (1.0001 ** Number(tick));
    const decimalShift = 10 ** (Number(tokenDecimals0) - Number(tokenDecimals1));
    return ratio * decimalShift;
}

async function start() {

    tronWeb.setAddress('TEe5MgWnhEEEoMUrRBsAovSJnDK4QQivBe');

    // read trc20 account balance
    let contract = await tronWeb.contract(abi, 'TRzE68tbBoy2Ec5vLTLzQEPCUXktu4bB6D');
    // let contract = await tronWeb.contract().at("TRzE68tbBoy2Ec5vLTLzQEPCUXktu4bB6D");
    let data = await contract.slot0().call();

    // let result = await contract.getPool('TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR','TKKkXMr7uuZ5kdajTcTqz9YNhAfNZnr7wm',3000).call()
    // let result = await contract.owner().call()

    const rev_trx_price = roundToMillionth(tickToPrice(data.tick, 2 , 6));
    const trx_rev_price = Math.round(1/rev_trx_price);

    // console.log(roundToMillionth(price))

    console.log(rev_trx_price)
    console.log(trx_rev_price)

}

start();