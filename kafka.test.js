const { Kafka } = require('kafkajs');
const { KafkaContainer } = require('@testcontainers/kafka');

describe('Kafka Integration Test with Testcontainers', () => {
    let container;
    let kafka;
    let broker;
    let topic = 'test-topic';

    beforeAll(async () => {
        container = await new KafkaContainer().start();
        broker = `${container.getHost()}:${container.getMappedPort(9093)}`;
        kafka = new Kafka({
            clientId: 'test-client',
            brokers: [broker],
            enforceRequestTimeout: false
        });

        // Wait for Kafka to be ready and create the topic
        const admin = kafka.admin();
        await admin.connect();
        await admin.createTopics({
            topics: [{ topic }],
            waitForLeaders: true,
        });
        await admin.disconnect();

        // Wait a bit for the group coordinator to become available
        await new Promise(resolve => setTimeout(resolve, 10000));
    }, 60000);

    afterAll(async () => {
        await container.stop();
    });

    async function produceMessage(message) {
        const producer = kafka.producer();
        await producer.connect();
        await producer.send({
            topic,
            messages: [{ value: message }],
        });
        await producer.disconnect();
    }

    async function consumeMessage(consumer) {
        await consumer.subscribe({ topic, fromBeginning: true });

        return new Promise((resolve) => {
            consumer.run({
                eachMessage: async ({ message }) => {
                    resolve(message.value.toString());
                },
            });
        });
    }

    afterEach(async () => {
        // Optionally, clean up resources or topics if needed
    });    

    test('should produce and consume a message', async () => {
        const testMessage = 'hello kafka';
        await produceMessage(testMessage);
        const consumer = kafka.consumer({ groupId: 'test-group' });
        await consumer.connect();
        const received = await consumeMessage(consumer);
        expect(received).toBe(testMessage);
        await consumer.disconnect();
    }, 20000);
});