import Block from './block.js';
import cryptoHash from './crypto-hash.js';


class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            prevBlock: this.chain[this.chain.length - 1],
            data
        });
        this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const { timestamp, prevHash, hash, data, nonce, difficulty } = chain[i];
            const realLastHash = chain[i - 1].hash;
            const lastDifficulty = chain[i - 1].difficulty;

            if (prevHash !== realLastHash) {
                return false;
            }

            const validatedHash = cryptoHash(timestamp, prevHash, data, nonce, difficulty);

            if (hash !== validatedHash) {
                return false;
            }
            if (Math.abs(lastDifficulty - difficulty > 1)) {
                return false;
            }
        }

        return true;
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error("The incoming chain isn't longer!");
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error("The incoming chain isn't valid!");
            return;
        }

        this.chain = chain;
        console.log("Replacing chain with", chain);
    }
}

const blockchain = new Blockchain();
blockchain.addBlock({ data: "block1" });
blockchain.addBlock({ data: "block2" });

// console.log(blockchain.chain);

const isValid = Blockchain.isValidChain(blockchain.chain);
// console.log(isValid);

export default Blockchain;