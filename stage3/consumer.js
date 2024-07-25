require('dotenv').config();
const pulsar = require('pulsar-client');

const { PULSAR_SERVICE_URL, TOPIC_NAME, SUBSCRIPTION_NAME, SUBSCRIPTION_TYPE} = process.env;

const serviceUrl = PULSAR_SERVICE_URL;
const topicName = TOPIC_NAME;
const subscriptionName = SUBSCRIPTION_NAME;
const subscriptionType = SUBSCRIPTION_TYPE;
(async () => {
  const client = new pulsar.Client({ serviceUrl });

  const consumer = await client.subscribe({
    topic: topicName,
    subscription: subscriptionName,
    subscriptionType: subscriptionType
  });

  console.log('Consumer is listening for messages...');

  // Continuous loop to keep the consumer open
  while (true) {
    try {
      const msg = await consumer.receive();
      const data = msg.getData().toString();
      console.log(`Received message: ${data}`);
      consumer.acknowledge(msg);
    } catch (err) {
      console.error('Error receiving message:', err);
    }
  }
})();
