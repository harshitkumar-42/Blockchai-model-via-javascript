import crypto from "crypto"

const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.sort().join());
    return hash.digest('hex')
}

const result = cryptoHash("World", "Hello");
// console.log(result);

export default cryptoHash;