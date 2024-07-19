const  Pulsar  = require('pulsar-client');

async function sendMessageToPulsarTopic() {
  const pulsarClient = await new Pulsar.Client({
    serviceUrl: 'pulsar://localhost:6650'
  });

  try {
    const producer = await pulsarClient.createProducer({
      topic: 'persistent://public/default/my-topic',
    });
    
    const messageData = { test: "test" }; // Your m
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


sendMessageToPulsarTopic()
