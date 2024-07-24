const Pulsar = require('pulsar-client');
require('dotenv').config();

async function consumeMessagesFromPulsarTopic(subscriptionName) {
  const pulsarClient = new Pulsar.Client({
    serviceUrl: process.env.PULSAR_SERVICE_URL
  });

  try {
    const consumer = await pulsarClient.subscribe({
      topic: process.env.TOPIC_PREFIX+"test",
      subscription: subscriptionName, // Unique subscription name
      subscriptionType: 'Shared', // Using Shared subscription type
      subscriptionInitialPosition: 'Latest' // Start consuming from the latest message
    });

    console.log(`Consumer with subscription ${subscriptionName} is ready. Waiting for messages...`);

    while (true) {
      // Receive a message from Pulsar
      const msg = await consumer.receive();
      const messageData = msg.getData().toString();

      console.log(`Received message on ${subscriptionName}: ${messageData}`);

      // Acknowledge the message after processing
      consumer.acknowledge(msg);
    }
  } catch (error) {
    console.error(`Failed to consume message for subscription ${subscriptionName}:`, error);
  } finally {
    await pulsarClient.close();
  }
}

// Example usage: Pass unique subscription names for each consumer
consumeMessagesFromPulsarTopic('unique-subscription-1');
// Add more consumers with unique subscription names as needed
