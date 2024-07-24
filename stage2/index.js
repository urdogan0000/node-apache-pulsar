require('dotenv').config();
const createPulsarClient = require('./pulsarClient');
const createProducers = require('./createProducers');
const createConsumers = require('./createConsumers');

const main = async () => {
  const client = createPulsarClient();

  try {
    await createProducers(client);
    await createConsumers(client);
  } catch (err) {
    console.error('Error in Pulsar operations', err);
  }

  // Close the client after some time or based on your logic
  setTimeout(() => {
    client.close();
  }, 60000); // 1 minute for example
};

main();
