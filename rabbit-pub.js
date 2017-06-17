#!/usr/bin/env node

const argv = require('yargs').argv;
const amqp = require('amqplib');

// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.151.27:5672';
const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.115:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.116:5672';

const durable = argv.d || false;
const ex = argv.exchange || 'logs';
const type = argv.t || 'fanout' // direct
const key = argv.k || '' // info

amqp.connect(host).then(function(conn) {
  return conn.createChannel().then(function(ch) {
    let ok = ch.assertExchange(ex, type, {durable: durable})
    let message = 'info: Hello World ' + Date.now();

    return ok.then(function() {
      ch.publish(ex, key, Buffer.from(message));
      console.log(" [x] Sent '%s'", message);
      return ch.close();
    });
  })/*.finally(_ => conn.close());*/
}).catch(console.warn);