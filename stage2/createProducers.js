require('dotenv').config();

const createProducers = async (client) => {
  const numTopics = parseInt(process.env.NUM_TOPICS, 10);
  const numMessages = parseInt(process.env.NUM_MESSAGES, 10);
  const topicPrefix = process.env.TOPIC_PREFIX;

  const producerPromises = [];

  for (let i = 1; i <= numTopics; i++) {
    const topic = `${topicPrefix}${i}`;
    producerPromises.push(createProducer(client, topic, numMessages, i));
  }

  await Promise.all(producerPromises);
  console.log('All producers have sent their messages.');
};

const createProducer = async (client, topic, numMessages, producerId) => {
  const producer = await client.createProducer({
    topic: topic,
  });

  const messagePromises = [];

  for (let j = 1; j <= numMessages; j++) {
    messagePromises.push(producer.send({
      data: Buffer.from(`Message ${j} from producer ${producerId}`),
    }));
  }

  await Promise.all(messagePromises);
  await producer.close();
  console.log(`Producer for ${topic} sent ${numMessages} messages.`);
};

module.exports = createProducers;
