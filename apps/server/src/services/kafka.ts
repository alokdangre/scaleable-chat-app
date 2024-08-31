import { Kafka, Producer } from "kafkajs";
import fs from 'fs'
import path from "path";
import prismaClient from "./prisma";

const username: string = process.env.KAFKA_USERNAME!;
const password: string = process.env.KAFKA_PASSWORD!;
const broker: string = process.env.KAFKA_BROKER!;
// const machanism: string = process.env.KAFKA_MECH!;
const key = [fs.readFileSync(path.resolve('./ca.pem'), "utf-8")];
console.log(key)

const kafka = new Kafka({
    brokers: [broker],
    ssl: {
        ca: key,
    },
    sasl: {
        username: username,
        password: password,
        mechanism: 'plain'
    },
    connectionTimeout: 10000,
})

let producer: null | Producer = null;

export async function createProducer() {
    if(producer) return producer

    const _producer = kafka.producer()
    await _producer.connect();
    producer = _producer;

    return producer;
}

export async function producerMessage(message: string) {
    const producer = await createProducer();
    await producer.send({
        messages: [{ key: `message-${Date.now()}`, value: message }],
        topic: `MESSAGES`,
    })

    return true;
}

export async function startMessageConsumer() {
    const consumer = kafka.consumer({groupId: "default"});
    await consumer.connect()
    await consumer.subscribe({topic: "MESSAGES", fromBeginning: true});

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({message, pause}) => {
            if(!message.value) return
            console.log(`New Message Recv..`)
            try {
                await prismaClient.message.create({
                    data: {
                        text: message.value?.toString()
                    },
                });
            } catch (error) {
                console.log('Something is wrong')
                pause()
                setTimeout(() => { 
                    consumer.resume([{topic: "MESSAGES"}])
                }, 60 * 1000);
            }
        }
    })
}

export default kafka;