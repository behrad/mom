#!/usr/bin/env node
const argv = require('yargs').argv;
const amqp = require('amqplib');

const host = 'amqp://admin:mqadminP@ssw0rd@10.10.151.27:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.115:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.116:5672';

amqp.connect(host).then(function(conn) {
  return conn.createChannel().then(function(ch) {
    const q = argv.q || 'task_queue';
    const ok = ch.assertQueue(q, {durable: true});

    return ok.then(function() {
      const msg = "Hello World " + Date.now();
      ch.sendToQueue(q, Buffer.from(msg), {persistent: true, deliveryMode: true});
      console.log(" [x] Sent '%s'", msg);
      return ch.close();
    });
  }).finally(_ => conn.close());
}).catch(console.warn);