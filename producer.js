#!/usr/bin/env node

// node producer.js -r 1000

const argv = require('yargs').argv
const kafka = require('kafka-node');

let rate = 2000
if (argv.r) {
  rate = 1 / (argv.r / 1000)
}

const topic = argv.topic || 'test.behrad.topic'

const client = new kafka.Client('10.10.151.27:2181', 'my-test-nodejs-client');
const producer = new kafka.HighLevelProducer(client, {
  requireAcks: 1,
  ackTimeoutMs: 500,
  partitionerType: 2
});

producer.on('error', err => {
  console.log('Error ', err);
});

producer.on('ready', () => {
  setInterval( ()=>{
    producer.send([{
      topic: topic,
      messages: ['message body ' + new Date]
    }], function (err, data) {
      if(err)
        return console.error('Error sending ', err);

      console.log('Payload sent ', data);
    });
  }, rate)
});