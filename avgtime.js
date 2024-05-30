import Blockchain from "./blockchain.js";

const blockchain = new Blockchain();
const times = [];
let prevTimestamp, nextTimestamp, nextBlock, averageTime, timeDiff;
blockchain.addBlock({ data: "new data" })
for (let i = 0; i < 1000; i++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
    blockchain.addBlock({ data: `block ${i}` })
    nextBlock = blockchain.chain[blockchain.chain.length - 1];
    nextTimestamp = nextBlock.timestamp;
    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);
    averageTime = times.reduce((total, num) => total + num) / times.length;
    console.log(`Time to mine block: ${timeDiff}ms difficulty: ${nextBlock.difficulty} Average time: ${averageTime} `)
}