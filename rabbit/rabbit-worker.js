#!/usr/bin/env node

const argv = require('yargs').argv;
const amqp = require('amqplib');

const host = 'amqp://admin:mqadminP@ssw0rd@10.10.151.27:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.115:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.116:5672';

const q = argv.q || 'task_queue';

amqp.connect(host).then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {
    let ok = ch.assertQueue(q, {durable: true});
    ok = ok.then(function() { ch.prefetch(1); });
    ok = ok.then(function() {
      ch.consume(q, doWork, {noAck: false});
      console.log(" [*] Waiting for messages. To exit press CTRL+C");
    });
    return ok;

    function doWork(msg) {
      const body = msg.content.toString();
      console.log(" [x] Received '%s'", body);
      const secs = body.split('.').length - 1;
      //console.log(" [x] Task takes %d seconds", secs);
      setTimeout(function() {
        console.log(" [x] Done");
        ch.ack(msg);
      }, secs * 1000);
    }
  });
}).catch(console.warn);