const Pulsar = require('pulsar-client');
require('dotenv').config();

let pulsarClient;
let producers = {}; // To track producers by topic

async function getProducer(topic) {
  if (!pulsarClient) {
    pulsarClient = new Pulsar.Client({
      serviceUrl: process.env.PULSAR_URL
    });
  }

  if (!producers[topic]) {
    try {
      const producer = await pulsarClient.createProducer({
        topic: topic,
        compressionType: 'ZSTD'
      });
      console.log('Producer created successfully for topic:', topic);
      producers[topic] = producer;
    } catch (error) {
      console.error('Failed to create producer for topic:', topic, error);
      throw error;
    }
  }
  
  return producers[topic];
}

async function closeProducers() {
  for (const [topic, producer] of Object.entries(producers)) {
    try {
      await producer.close();
      console.log('Producer closed successfully for topic:', topic);
    } catch (error) {
      console.error('Failed to close producer for topic:', topic, error);
    }
  }
  producers = {}; // Clear the producer map
}

async function closeClient() {
  if (pulsarClient) {
    try {
      await pulsarClient.close();
      console.log('Pulsar client closed successfully.');
    } catch (error) {
      console.error('Failed to close Pulsar client:', error);
    }
  }
}

async function sendMessageToPulsarTopic() {
  let producer;
  
  try {
    producer = await getProducer(process.env.SAMPLE_TOPIC);

    for (let i = 0; i < 5; i++) {
      const messageData = { test: "test", messageNumber: i };
      const message = Buffer.from(JSON.stringify(messageData));
      await producer.send({ data: message });
      console.log(`Sent message ${i + 1}`);
    }
  } catch (error) {
    console.error('Failed to send message to Pulsar topic:', error);
  } finally {
    if (producer) {
      await producer.close();
    }
    await pulsarClient.close();
  }
}
sendMessageToPulsarTopic()


module.exports = {
  getProducer,
  closeProducers,
  closeClient
};
