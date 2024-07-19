const Pulsar = require('pulsar-client');

async function createConsumer(subscriptionName) {
  const client = new Pulsar.Client({
    serviceUrl: 'pulsar://localhost:6650'
  });

  try {
    const consumer = await client.subscribe({
      topic: 'persistent://public/default/my-topic',
      subscription: subscriptionName,
      subscriptionType: 'KeyShared',
    });

    console.log(`Consumer with subscription ${subscriptionName} ready.`);

    while (true) {
      const msg = await consumer.receive();
      console.log(`Received message for ${subscriptionName}:`, msg.getData().toString());
      consumer.acknowledge(msg);
    }
  } catch (err) {
    console.error(`Error receiving message for ${subscriptionName}:`, err);
  }
}

module.exports = createConsumer;
