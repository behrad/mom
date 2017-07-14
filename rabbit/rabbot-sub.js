const util = require("util");
const rabbot = require("rabbot");
const connect = require('./rabbot');
const bench = require('fastbench');

connect( _ => {
  let count = 0;

  rabbot.handle( "#", function( msg ) {
    count === 0 ? console.time('1000') : '';
    count === 1000 ? console.time('2000') : '';
    count === 2000 ? console.time('3000') : '';

    console.log( "Received:", JSON.stringify( msg.body ) );
    msg.ack();
    count++;

    count === 1000 ? console.timeEnd('1000') : '';
    count === 2000 ? console.timeEnd('2000') : '';
    count === 3000 ? console.timeEnd('3000') : '';

  });

  rabbot.startSubscription('rabbot-q2', true);

  process.on('SIGINT', function() {
    rabbot.shutdown(function() {
      process.exit()
    })
  })
});