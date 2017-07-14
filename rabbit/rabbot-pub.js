const util = require("util");
const rabbot = require("rabbot");
const connect = require('./rabbot');
const bench = require('fastbench');


connect();

let published = 0;
const message = {};

function publish(cb) {
  rabbot.publish("rabbot-ex-new", {
    routingKey: 'behrad.test',
    type: 'behrad.hahaha',
    body: {
      message: "Message " + published
    }
  }).then(function() {
    console.log("published message");
    published++;
    cb && cb();
  });
}



setInterval(_ => {
  console.log(`Published=${published}`)
}, 1000)

// const timer = setInterval(_ => {
//   publish()
// }, 500)

bench([publish], 10)();

process.on('SIGINT', function() {
  // timer && clearInterval(timer);
  rabbot.shutdown(function() {
  })
  process.exit()
})