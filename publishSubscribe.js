import { createClient } from "redis";
import Blockchain from "./blockchain.js";

const CHANNELS = {
    TEST: "TEST",
    BLOCKCHAIN: "BLOCKCHAIN"
};

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;
        this.publisher = createClient();
        this.subscriber = createClient();

        this.connectClients();
    }

    async connectClients() {
        try {
            await this.publisher.connect();
            console.log('Publisher connected');
        } catch (err) {
            console.error('Publisher connection error:', err);
        }

        try {
            await this.subscriber.connect();
            console.log('Subscriber connected');
            await this.subscriber.subscribe(CHANNELS.TEST, (message) => {
                this.handleMessage(CHANNELS.TEST, message);
            });
            await this.subscriber.subscribe(CHANNELS.BLOCKCHAIN, (message) => {
                this.handleMessage(CHANNELS.BLOCKCHAIN, message);
            });
        } catch (err) {
            console.error('Subscriber connection error:', err);
        }
    }

    handleMessage(channel, message) {
        console.log(`Message: ${message} on channel: ${channel}`);
        const parsedMessage = JSON.parse(message);
        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    async publish({ channel, message }) {
        try {
            await this.publisher.publish(channel, message);
            console.log(`Message published to channel ${channel}`);
        } catch (err) {
            console.error('Publish error:', err);
        }
    }

    broadcastChain(chain) {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

export default PubSub;