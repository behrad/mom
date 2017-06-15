const kafka = require('kafka-node');

const client = new kafka.Client('10.10.151.27:2181', 'my-test-nodejs-client-con');

const consumer = new kafka.Consumer(client, [{
  topic: 'topicName'
}], {
  groupId: 'kafka-node-group-1',
  id: 'my-consumer-id',
  autoCommit: true,
  fromOffset: false
});

consumer.on('error', err => {
  console.log('Error ', err);
});

consumer.on('message', function (message) {
  console.log('New Message ', message);
});


process.on('SIGINT', function () {
  consumer.close(true, function () {
    process.exit();
  });
});