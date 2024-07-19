const Pulsar = require('pulsar-client');
require('dotenv').config();

// Debugging log to check available compression types
console.log('Available Compression Types:', Pulsar.CompressionType);

async function sendMessageToPulsarTopic() {
  const pulsarClient = new Pulsar.Client({
    serviceUrl: process.env.PULSAR_URL
  });

  try {
    const producer = await pulsarClient.createProducer({
      topic: process.env.SAMPLE_TOPIC,
      compressionType:'ZSTD'

    });

    for (let i = 0; i < 5000; i++) {
      const messageData = { test: "test", messageNumber: i };
      const message = Buffer.from(JSON.stringify(messageData));

      await producer.send({
        data: message,
      });
      console.log(`Sent message ${i + 1}`);
    }
  } catch (error) {
    console.error('Failed to send message to Pulsar topic:', error);
  } finally {
    await pulsarClient.close();
  }
}

sendMessageToPulsarTopic();