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

    return connection.createChannel();
  })
  .then( channel => {
    channel.on('drain', ()=>{ console.log('channel drain') });
    channel.on('close', ()=>{ console.log('channel Closed') });
    channel.on('error', (err)=>{ console.error(`channel Error ${err}`)});
    channel.on('return', (msg)=>{ console.log(`channel return ${msg}`)});


    const QueueName = 'rpcQueue';

    channel.assertQueue(QueueName, {durable: false})
      .then(q => console.log(`Queue %j`, q))
      .catch(console.error);

    channel.prefetch(1, false);

    // let options = {
    //   consumerTag: '',
    //   noAck: true,
    //   exclusive: false,
    //   priority: 1
    // };

    return channel.consume(QueueName, function reply (msg) {
      if (msg !== null) {
        console.log(`Message '${msg.content.toString()}' %j`, msg);
        channel.sendToQueue(msg.properties.replyTo,
          new Buffer(msg.content.toString()),
          {correlationId: msg.properties.correlationId});
        channel.ack(msg);
      } else {
        console.warn(`WOW! message is null?`);
      }
    })
      .then(_consumeOk => console.log(`We are consuming %j`, _consumeOk));
  })
  .catch(console.error);