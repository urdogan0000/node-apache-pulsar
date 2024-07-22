const createConsumer = require('./consumer'); // Assuming the consumer function is in 'consumer.js'
require('dotenv').config();

async function startConsumers(numConsumers) {
  const consumerPromises = [];
  
  const consumerCount = parseInt(numConsumers, 10);
  
  if (isNaN(consumerCount) || consumerCount <= 0) {
    console.error('Invalid CLIENT_SIZE. It must be a positive number.');
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

// Start consumers based on the CLIENT_SIZE environment variable
startConsumers(process.env.CLIENT_SIZE).catch(error => {
  console.error('Unhandled error:', error);
});
