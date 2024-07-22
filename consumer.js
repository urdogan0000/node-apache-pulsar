const Pulsar = require('pulsar-client');
require('dotenv').config();
const { getProducer, closeProducers, closeClient } = require('./producer');

// Singleton Pulsar client instance
const pulsarClient = new Pulsar.Client({
  serviceUrl: process.env.PULSAR_URL
});

// Utility function to get a consumer
async function getConsumer(subscriptionName) {
  try {
    return await pulsarClient.subscribe({
      topic: process.env.SAMPLE_TOPIC,
      subscription: subscriptionName,
      subscriptionType: process.env.CONSUMER_SC_TYPE,
      subscriptionInitialPosition: 'Latest'
    });
  } catch (error) {
    console.error(`Failed to create Pulsar consumer for ${subscriptionName}:`, error);
    throw error;
  }
}

// Main consumer function
async function createConsumer(subscriptionName) {
  let consumer;

  try {
    consumer = await getConsumer(subscriptionName);
    console.log(`Consumer with subscription ${subscriptionName} ready.`);

    while (true) {
      try {
        const msg = await consumer.receive();
        const messageData = msg.getData().toString();
        console.log(`Received message on ${subscriptionName}: ${messageData}`);

    
        consumer.acknowledge(msg);
      } catch (receiveError) {
        console.error(`Error receiving message for ${subscriptionName}:`, receiveError);
      }
    }
  } catch (err) {
    console.error(`Error setting up consumer for ${subscriptionName}:`, err);
  } finally {
    if (consumer) {
      await consumer.close();
    }
  }
}

module.exports = createConsumer;

// Close Pulsar client and producers on process exit
process.on('exit', async () => {
  await closeProducers();
  await closeClient();
});

process.on('SIGINT', async () => {
  console.log('Process interrupted. Closing Pulsar client and producers...');
  await closeProducers();
  await closeClient();
  process.exit();
});
