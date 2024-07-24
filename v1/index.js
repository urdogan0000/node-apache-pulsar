const createConsumer = require('./consumer'); // Assuming the consumer function is in 'consumer.js'
require('dotenv').config();

async function startConsumers(numConsumers) {
  const consumerPromises = [];
  
  const consumerCount = parseInt(numConsumers, 10);
  
  if (isNaN(consumerCount) || consumerCount <= 0) {
    console.error('Invalid NUM_CONSUMERS. It must be a positive number.');
    return;
  }

  for (let i = 1; i <= consumerCount; i++) {
    const subscriptionName = `sub${i}`;
    consumerPromises.push(createConsumer(subscriptionName));
  }
  
  try {
    await Promise.all(consumerPromises);
    console.log(`Successfully started ${consumerCount} consumers.`);
  } catch (error) {
    console.error('Error starting consumers:', error);
  }
}

// Start consumers based on the NUM_CONSUMERS environment variable
startConsumers(process.env.NUM_CONSUMERS).catch(error => {
  console.error('Unhandled error:', error);
});
