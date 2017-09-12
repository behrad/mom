const AMQP = require('amqplib');

const host = 'amqp://admin:mqadminP@ssw0rd@10.10.151.27:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.115:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.116:5672';

const rabbit = AMQP.connect(host);

const concurrency = 1

rabbit
  .then( connection => {

    connection.on('close', ()=>{ console.log('connection Closed') });
    connection.on('error', (err)=>{ console.error(`connection Error ${err}`)});
    connection.on('blocked', (reason)=>{ console.warn(`connection Blocked for ${reason}`)});

    return connection.createConfirmChannel(); //createConfirmChannel
  })
  .then( channel => {

    const QueueName = 'rpcQueue';
    // const QueueName = 'mqtt-subscription-behradMqttqos1';
    channel.assertQueue('', {exclusive: true})
      .then(q => {
        console.log(`My Queue is %j`, q)

        const corr = Date.now() + ''

        channel.consume(q.queue, function(msg) {
          if (msg.properties.correlationId === corr) {
            console.log('Got reply %s', msg.content.toString());
          }
        }, {noAck: true});

        send(corr, q.queue)
      })
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

    function send(corr, queue){
      const id = Date.now()+'';
      channel.sendToQueue(
        QueueName,
        new Buffer(`Message number ${id}`),
        {correlationId: corr, replyTo: queue});
    }
  })
  .catch(console.error);