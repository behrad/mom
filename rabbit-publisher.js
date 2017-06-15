const AMQP = require('amqplib');

const host = 'amqp://admin:mqadminP@ssw0rd@10.10.151.27:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.115:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.116:5672';

const rabbit = AMQP.connect(host);

rabbit
  .then( connection => {

    connection.on('close', ()=>{ console.log('connection Closed') });
    connection.on('error', (err)=>{ console.error(`connection Error ${err}`)});
    connection.on('blocked', (reason)=>{ console.warn(`connection Blocked for ${reason}`)});

    return connection.createConfirmChannel(); //createConfirmChannel
  })
  .then( channel => {

    const QueueName = 'testQueue';
    // const QueueName = 'mqtt-subscription-behradMqttqos1';
    channel.assertQueue(QueueName)
      .then(q => console.log(`Assert Queue %j`, q))
      .catch(console.error);

    channel.on('drain', ()=>{ console.log('channel drain') });
    channel.on('close', ()=>{ console.log('channel Closed') });
    channel.on('error', (err)=>{ console.error(`channel Error ${err}`)});
    channel.on('return', (msg)=>{ console.log(`channel return ${msg}`)});

    // let options = {
    //   expiration: '',
    //   persistent: true,
    //   correlationId: '',
    //   replyTo: '',
    //   messageId: '',
    //   timestamp: '',
    //   type: '',
    //   appId: ''
    // };

    const id = Date.now()+'';
    return channel.sendToQueue('test.'+id+'.queue', new Buffer(`Message number ${id}`), {messageId: id});
  })
  .then(a1 => console.log(`Sent message %j`, a1))
  .catch(console.error);