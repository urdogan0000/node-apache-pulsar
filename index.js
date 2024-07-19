const createConsumer = require('./consumer'); // Assuming the consumer function is in 'consumer.js'

async function startConsumers(numConsumers) {
  const consumerPromises = [];
  for (let i = 1; i <= numConsumers; i++) {
    const subscriptionName = `sub${i}`;
    consumerPromises.push(createConsumer(subscriptionName));
  }
  await Promise.all(consumerPromises);
}

// Start 200 consumers
startConsumers(5000).catch(console.error);