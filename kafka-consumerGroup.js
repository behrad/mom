#!/usr/bin/env node

const argv = require('yargs').argv
const kafka = require('kafka-node');
const ConsumerGroup = kafka.ConsumerGroup;

const topic = argv.topic || ["test.ali.topic", 'test.behrad.topic']

const options = {
  host: '10.10.151.27:2181',
  groupId: argv.g || 'testGroup2',
  sessionTimeout: 10000,
  protocol: ['roundrobin'],
  fromOffset: 'earliest' // 'none', 'latest', 'earliest'
};

const group = new ConsumerGroup(Object.assign({id: 'testConsumer'}, options), topic);
group.on('error', onError);
group.on('message', onMessage);


function onError (error) {
  console.error('Error on consumer group ', error)
}

function onMessage (message) {
  console.log('%s READ Topic="%s" Partition=%s Offset=%d: ',
    this.client.clientId, message.topic, message.partition, message.offset, message.value);
}

process.once('SIGINT', function () {
  group.close(true, console.log);
});