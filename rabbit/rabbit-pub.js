#!/usr/bin/env node

// node rabbit-pub.js -e logs2 -t topic -k test.behrad.topic -n 1000

const argv = require('yargs').argv;
const amqp = require('amqplib');

const host = 'amqp://admin:mqadminP@ssw0rd@10.10.151.27:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.115:5672';
// const host = 'amqp://admin:mqadminP@ssw0rd@10.10.101.116:5672';

const durable = argv.d || false;
const persist = argv.p || false;
const ex = argv.e || 'logs';
const type = argv.t || 'fanout' // direct, topic
const key = argv.k || '' // info

const concurrency = argv.n || 1

const Stats = require('../stats')
const s = new Stats({interval: 1})

amqp.connect(host).then(function(conn) {

  return conn.createChannel().then(function(ch) {
    let ok = ch.assertExchange(ex, type, {durable: durable})

    return ok.then(function() {
      ch.on('drain', _ => {
        console.log('Channel drain')
        send()
      })

      function send() {
        let message = 'Hello World ' + Date.now();
        const _sent = ch.publish(ex, key, Buffer.from(message), {persistent: persist})
        // console.log("[x] Sent '%s'? ", message, _sent);
        s.inc('sent');
        _sent && setTimeout(send, 1/(concurrency/1000))
      }

      return send()
      // return ch.close();
    });
  })
  /*.finally(_ => conn.close());*/
}).catch(console.warn);
