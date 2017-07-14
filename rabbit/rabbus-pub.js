const util = require("util");
const Rabbus = require("rabbus");
const rabbot = require("rabbot");
const connect = require('./rabbot');
const bench = require('fastbench');

function SomePublisher(){
  connect();

  Rabbus.Publisher.call(this, rabbot, {
    exchange: {
      name: "rabbus-exchange",
      persistent: true,
    },
    routingKey: "rabbus.test"
  });
}

util.inherits(SomePublisher, Rabbus.Publisher);

// publish a message
// -----------------

const publisher = new SomePublisher();

let published = 0;

const message = {};

function publish(cb) {
  message.place = 'Hello ' + published;
  publisher.publish(message, function(e){
    if (e) console.error(e)
    else published++;
  });
  cb && cb();
}



setInterval(_ => {
  console.log(`Published=${published}`)
}, 1000)

// const timer = setInterval(_ => {
//   publish()
// }, 500)

bench([publish], 1000)();

process.on('SIGINT', function() {
  // timer && clearInterval(timer);
  rabbot.shutdown(function() {
  })
  process.exit()
})