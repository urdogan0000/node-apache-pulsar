const Pulsar = require('pulsar-client');
require('dotenv').config();

const createPulsarClient = () => {
  return new Pulsar.Client({
    serviceUrl: process.env.PULSAR_SERVICE_URL,
  });
};

module.exports = createPulsarClient;
