#!/usr/bin/env node

const argv = require('yargs').argv;
const amqp = require('amqplib');

const host = 'amqp://admin:mqadminP@ssw0rd@10.10.151.27:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.115:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.116:5672';

const durable = argv.d || false;
const exchange = argv.exchange || 'logs';
const type = argv.t || 'fanout' // direct, topic
const key = argv.k || '' // info

amqp.connect(host).then(function(conn) {
  process.once('SIGINT', _ => conn.close());

  return conn.createChannel().then(function(ch) {
    let ok = ch.assertExchange(exchange, type, {durable: durable});
    ok = ok.then(function() {
      return ch.assertQueue('123', {exclusive: false});
    });
    ok = ok.then(function(qok) {
      return ch.bindQueue(qok.queue, exchange, key).then(function() {
        return qok.queue;
      });
    });
    ok = ok.then(function(queue) {
      return ch.consume(queue, logMessage, {noAck: true});
    });
    return ok.then(function() {
      console.log(' [*] Waiting for logs. To exit press CTRL+C');
    });

    function logMessage(msg) {
      console.log(" [x] '%s'", msg.fields.routingKey, msg.content.toString());
    }
  });
}).catch(console.warn);
