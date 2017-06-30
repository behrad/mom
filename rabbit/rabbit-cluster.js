const amqp = require('amqp-connection-manager');

const connection = amqp.connect([
  'amqp://admin:mqadminP@ssw0rd@10.10.101.115:5672',
  'amqp://admin:mqadminP@ssw0rd@10.10.101.116:5672'
], {json: true});

// connection.isConnected()
// connection.close()

connection.on('connect', connection => {
  console.log('Connected ', connection.url);
});
connection.on('disconnect', err => {
  console.error('Disconnected ', err)
});


const queueName = 'testQueue';

const channelWrapper = connection.createChannel({
  setup: function(channel) {
    console.log(`Oh, we got reconnected`);
    return channel.assertQueue(queueName, {durable: true})
  }
});

channelWrapper.on('connect', () => {
  console.log('Channel connected');
});
channelWrapper.on('error', (err) => {
  console.log('Channel Error ', err);
});
channelWrapper.on('drop', (message, err) => {
  console.log('Message Dropped ', err, message);
});
channelWrapper.on('close', () => {
  console.log('Channel closed');
});

// channelWrapper.sendToQueue(queueName, {hello: 'world'})
//   .then(function(a1) {
//     return console.log(`sendToQueue was sent, Hooray %j`, a1);
//   })
//   .catch(function(err) {
//     return console.error(`sendToQueue was rejected...  ${err}`);
//   });


channelWrapper.addSetup(function(channel) {
  // channel.assertQueue(queueName, { /*exclusive: true, autoDelete: true*/ }),
  // channel.bindQueue(queueName, "my-exchange", "create"),
  channel.consume(queueName, msg => {
    let body = msg.content.toString();
    console.log(`Receive message ${body}: `, msg);
    channelWrapper.ack(msg);
  })
    .then(ok => console.log(`We are consuming by ${ok.consumerTag}`))
    .catch(console.error);
});

//
// channelWrapper.waitForConnect()
//   .then(function() {
//     console.log("waitForConnect done!");
//   });