const createConsumer = require('./consumer'); // Assuming the consumer function is in 'consumer.js'
require('dotenv').config();

async function startConsumers(numConsumers) {
  const consumerPromises = [];
  for (let i = 1; i <= numConsumers; i++) {
    const subscriptionName = `sub${i}`;
    consumerPromises.push(createConsumer(subscriptionName));
  }
  await Promise.all(consumerPromises);
}

// Start 200 consumers
startConsumers(process.env.CLIENT_SIZE).catch(console.error);