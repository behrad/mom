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

    const QueueName = 'testQueue';
    // const QueueName = 'mqtt-subscription-behradMqttqos1';
    channel.assertQueue(QueueName, {durable: false})
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

    function send(){
      const id = Date.now()+'';
      channel.sendToQueue(QueueName, new Buffer(`Message number ${id}`), {messageId: id})
        // NB: `sentToQueue` and `publish` both return a boolean
        // indicating whether it's OK to send again straight away, or
        // (when `false`) that you should wait for the event `'drain'`
        // to fire before writing again. We're just doing the one write,
        // so we'll ignore it.
        .then(_sendOk => {
          console.log(`Sent? %j`, _sendOk)
          _sendOk && setTimeout(send, 1/(concurrency*1000))
        })
    }

    send()
  })
  .catch(console.error);