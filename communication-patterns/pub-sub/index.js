const { Kafka } = require('kafkajs');
const dotenv = require('dotenv')

dotenv.config();
 
const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER],
  sasl: {
    mechanism: 'scram-sha-256',
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD,
  },
  ssl: true,
})

const publish = async () => {
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
        topic: 'jobs',
        messages: [
            { key: '1', value: JSON.stringify({ job_id: 1, status: 'SCHEDULED' })},
            { key: '2', value: JSON.stringify({ job_id: 2, status: 'SCHEDULED' })},
        ],
    });
    await producer.disconnect();
}

const subscribe = async () => {
    const consumer = kafka.consumer({ groupId: 'jobs:pub-sub' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'jobs', fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
            value: message.value.toString(),
            })
        },
    });
    consumer.disconnect();   
}

const run = async () => {
    await publish();
    await subscribe();
}

run();
 
 
