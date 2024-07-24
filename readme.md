# Pulsar Project

This project sets up an Apache Pulsar environment with producers and consumers using Node.js. The project is configured to run with Docker Compose and includes sample code to send and consume messages from Pulsar topics.

## Prerequisites

- Docker and Docker Compose
- Node.js
- npm (Node Package Manager)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/urdogan0000/node-apache-pulsar.git
cd node-apache-pulsar
```
### 2. Install Dependencies

Navigate to the project directory and install the necessary Node.js dependencies:

```
npm install
```


### 3. Set up Environment Variables

Create a .env file in the project root and add the following environment variables:

```bash
PULSAR_SERVICE_URL= pulsar://localhost:6650 
SUBSCRIPTION_TYPE= Shared
TOPIC_PREFIX= persistent://public/default/my-topic
NUM_CONSUMERS= 200
NUM_TOPICS=500
NUM_MESSAGES=10
```

### 4. Start Pulsar using Docker Compose


If you are using linux distrubitions,you should run

```
sudo mkdir -p ./data/zookeeper ./data/bookkeeper
# this step might not be necessary on other than Linux platforms
sudo chown -R 10000 data
```

This will start Zookeeper, Bookie, and Broker services for Apache Pulsar.

Ensure Docker is running, then start the Pulsar services with Docker Compose:

```
docker-compose up -d
```


### 5. Run the Producer

The producer sends messages to the specified Pulsar topic.
```
node producer.js
```
### 6. Run the Consumers

The consumers will listen for messages on the specified Pulsar topic.
```
node index.js
```
## Project Structure

    producer.js: Contains the code to send messages to the Pulsar topic.
    consumer.js: Contains the code to consume messages from the Pulsar topic.
    index.js: Starts multiple consumers.
    falback.js: Contains the code for a fallback consumer.
    .env: Environment variables configuration file.
    docker-compose.yml: Docker Compose file to set up Pulsar services.

## Docker Compose Configuration

The docker-compose.yml file sets up the following services:

    zookeeper: Zookeeper service for Pulsar.
    pulsar-init: Initializes Pulsar cluster metadata.
    bookie: Bookkeeper service for Pulsar.
    broker: Broker service for Pulsar.


# Notes

    Ensure you have the latest version of Docker and Docker Compose installed.
    Modify the .env file as needed to match your setup.
    Adjust the docker-compose.yml configuration if you have different requirements.

# License

This project is licensed under the MIT License - see the LICENSE file for details.


