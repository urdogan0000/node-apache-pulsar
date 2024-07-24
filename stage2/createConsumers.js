require('dotenv').config();

const createConsumers = async (client) => {
  const numTopics = parseInt(process.env.NUM_TOPICS, 10);
  const numConsumers = parseInt(process.env.NUM_CONSUMERS, 10);
  const topicPrefix = process.env.TOPIC_PREFIX;
  const subscriptionType = process.env.SUBSCRIPTION_TYPE;

  const consumerPromises = [];

  for (let i = 1; i <= numTopics; i++) {
    const topic = `${topicPrefix}${i}`;
    consumerPromises.push(createConsumersForTopic(client, topic, numConsumers, subscriptionType, i));
  }

  await Promise.all(consumerPromises);
  console.log('All consumers have been created.');
};

const createConsumersForTopic = async (client, topic, numConsumers, subscriptionType, topicId) => {
  const consumerPromises = [];

  for (let j = 1; j <= numConsumers; j++) {
    consumerPromises.push(createConsumer(client, topic, subscriptionType, topicId, j));
  }

  await Promise.all(consumerPromises);
};

const createConsumer = async (client, topic, subscriptionType, topicId, consumerId) => {
  const consumer = await client.subscribe({
    topic: topic,
    subscription: `sub-${topicId}-${consumerId}`,
    subscriptionType: subscriptionType,
  });

  // Handle incoming messages for this consumer
  (async () => {
    while (true) {
      const msg = await consumer.receive();
      console.log(`Consumer ${consumerId} for topic ${topicId} received: ${msg.getData().toString()}`);
      consumer.acknowledge(msg);
    }
  })();
};

module.exports = createConsumers;
