require('dotenv').config();
const pulsar = require('pulsar-client');

const {
  PULSAR_SERVICE_URL,
  TOPIC_NAME,
  PRODUCER_COUNT,
  MESSAGE_COUNT,
} = process.env;

const serviceUrl = PULSAR_SERVICE_URL;
const topicName = TOPIC_NAME;
const producerCount = parseInt(PRODUCER_COUNT, 10);
const messageCount = parseInt(MESSAGE_COUNT, 10);
const maxConcurrentProducers = 100; // Adjust this number to control concurrency
const delayBetweenBatches = 1000; // 1 second delay between batches

const messageContent = {
  type: "LOGIN",
  username: "etapadmin",
  ipAddresses: "'172.16.102.56'",
  timestamp: "25-07-2024 10:45",
  userIp: null,
  osVersion: "Pardus GNU/Linux 23 (yirmiuc)-23.1",
  diskTotal: 250804,
  diskUsed: 14146,
  diskFree: 223843,
  memory: 32005,
  hostname: "localhost.localdomain",
  hardwareUsbDevices: ["['Bus 001 Device 004: ID 046d:c534 Logitech, Inc. Unifying Receiver', 'Bus 001 Device 003: ID 28e1:b006 iSolu VST_Q10_65_36B_U', 'Bus 001 Device 002: ID 0bda:c821 Realtek Semiconductor Corp. Bluetooth Radio ']"],
  hardwareSystemDefinitions: ["['Manufacturer: VESTEL', 'Product Name: 17OPS22']"],
  agentVersion: "1.1.22",
  useSsh: false,
  keyVersion: null
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createProducer(id) {
  const client = new pulsar.Client({ serviceUrl });
  let producer;
  try {
    producer = await client.createProducer({
      topic: topicName,
      compressionType: 'ZSTD' // Using Zlib compression
    });
  } catch (err) {
    console.error(`Error creating producer ${id}:`, err);
    await client.close();
    return;
  }

  try {
    for (let i = 0; i < messageCount; i++) {
      const message = {
        ...messageContent,
        id,
        sequence: i
      };
      await producer.send({
        data: Buffer.from(JSON.stringify(message))
      });
      console.log(`Producer ${id} sent: ${JSON.stringify(message)}`);
    }
  } catch (err) {
    console.error(`Error from producer ${id}:`, err);
  } finally {
    await producer.close();
    await client.close();
  }
}

async function createProducersInBatches() {
  for (let i = 0; i < producerCount; i += maxConcurrentProducers) {
    const batch = Array.from(
      { length: Math.min(maxConcurrentProducers, producerCount - i) },
      (_, index) => createProducer(i + index)
    );
    await Promise.all(batch);
    console.log(`Batch ${i / maxConcurrentProducers + 1} complete`);
    await delay(delayBetweenBatches); // Add delay between batches
  }
}

(async () => {
  console.log('Starting producers...');
  try {
    await createProducersInBatches();
  } catch (err) {
    console.error('Error during producer batch creation:', err);
  }
  console.log('All producers have sent their messages');
})();
