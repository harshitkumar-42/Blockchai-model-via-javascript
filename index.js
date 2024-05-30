import Blockchain from "./blockchain.js";
import express, { response } from "express";
import bodyParser from "body-parser";
import PubSub from "./publishSubscribe.js";
import request from "request";

const app = express();
const blockchain = new Blockchain();
const pubSub = new PubSub({ blockchain })

setTimeout(() => pubSub.broadcastChain(), 1000)

app.use(bodyParser.json())

app.get("/api/blocks", (req, res) => {
    res.json(blockchain.chain); // Ensure the data is correctly formed
});

app.post("/api/mine", (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });
    pubSub.broadcastChain();
    res.redirect("/api/blocks")
})

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

const syncChange = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks}` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            console.log("Replace chain on sync with ", rootChain);
            blockchain.replaceChain(rootChain);
        }
    })
}

let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === "true") {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}
const PORT = PEER_PORT || DEFAULT_PORT

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
    syncChange()
});