const util = require("util");
const Rabbus = require("rabbus");
const rabbot = require("rabbot");
const connect = require('./rabbot');
const bench = require('fastbench');

function SomeSubscriber(){
  connect();

  Rabbus.Subscriber.call(this, rabbot, {
    exchange: "rabbus-exchange",
    routingKey: "rabbus.test",
    queue: {
      name: 'rabbus-queue',
      // noBatch: true,
      limit: 2000
    }
  });
}

util.inherits(SomeSubscriber, Rabbus.Subscriber);

// publish a message
// -----------------

const subscriber = new SomeSubscriber();
let count = 0;

subscriber.subscribe(function(message, properties, actions, next){
  count === 0 ? console.time('1000') : '';
  count === 1000 ? console.time('2000') : '';
  count === 2000 ? console.time('3000') : '';

  // console.log(`${count}: ${message.place}`)
  count++;
  actions.ack();

  count === 1000 ? console.timeEnd('1000') : '';
  count === 2000 ? console.timeEnd('2000') : '';
  count === 3000 ? console.timeEnd('3000') : '';
});

process.on('SIGINT', function() {
  rabbot.shutdown(function() {
    process.exit()
  })
})