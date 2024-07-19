const Pulsar = require('pulsar-client');
require('dotenv').config();

async function createConsumer(subscriptionName) {
  const client = new Pulsar.Client({
    serviceUrl: process.env.PULSAR_URL
  });

  try {
    const consumer = await client.subscribe({
      topic: process.env.SAMPLE_TOPIC,
      subscription: subscriptionName,
      subscriptionType: 'Shared',
      subscriptionInitialPosition:'Latest'
    });

    console.log(`Consumer with subscription ${subscriptionName} ready.`);

    while (true) {
      const msg = await consumer.receive();
      const message = msg.getData().toString();
      console.log(`Received message for ${subscriptionName}:`, message);
      consumer.acknowledge(msg);
      sendMessageToPulsarTopic();
    }
  } catch (err) {
    console.error(`Error receiving message for ${subscriptionName}:`, err);
  }
}


async function sendMessageToPulsarTopic() {
  const pulsarClient = new Pulsar.Client({
    serviceUrl: process.env.PULSAR_URL
  });

  try {
    const producer = await pulsarClient.createProducer({
      topic: process.env.SAMPLE_TOPIC+"test",
      compressionType:'ZSTD'

    });

      const messageData = { falback: "falbackkkkkkkkkkkkkkkkkkkkkkkk"};
      const message = Buffer.from(JSON.stringify(messageData));

      await producer.send({
        data: message,
      });
    
    
  } catch (error) {
    console.error('Failed to send message to Pulsar topic:', error);
  } finally {
    await pulsarClient.close();
  }
}

module.exports = createConsumer;
