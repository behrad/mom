#!/usr/bin/env node

// node rabbit-sub.js -e logs2 -t topic -k test.behrad.topic

const argv = require('yargs').argv;
const amqp = require('amqplib');

const host = 'amqp://admin:mqadminP@ssw0rd@10.10.151.27:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.115:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.116:5672';

const durable = argv.d || false;
const exchange = argv.e || 'logs';
const type = argv.t || 'fanout' // direct, topic
const key = argv.k || '' // info

const Stats = require('./stats')
const s = new Stats({interval: 1})

amqp.connect(host).then(function(conn) {
  process.once('SIGINT', _ => conn.close());

  return conn.createChannel().then(function(ch) {
    let ok = ch.assertExchange(exchange, type, {durable: durable});
    ok = ok.then(function() {
      return ch.assertQueue(key, {exclusive: false});
    });
    ok = ok.then(function(qok) {
      return ch.bindQueue(qok.queue, exchange, key).then(function() {
        return qok.queue;
      });
    });
    ok = ok.then(function(queue) {
      // ch.prefetch(false)
      return ch.consume(queue, logMessage, {noAck: true});
    });
    return ok.then(function() {
      console.log('[*] Waiting for logs. To exit press CTRL+C');
    });

    function logMessage(msg) {
      // console.log(" [x] '%s'", msg.fields.routingKey, msg.content.toString());
      s.inc('count')
      // ch.ack(msg)
    }
  });
}).catch(console.warn);
