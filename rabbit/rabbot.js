module.exports = function(cb) {
  const rabbot = require( "rabbot" );

  rabbot.configure({
    connection: {
      user: "admin",
      pass: "mqadminP@ssw0rd",
      server: ["10.10.101.115", "10.10.101.116"],
      port: 5672,
      timeout: 2000
    },
    "exchanges": [{
      "name": "rabbot-ex-new",
      "type": "topic",
      "autoDelete": false
    }],
    "queues": [{
      "name": "rabbot-q1",
      "autoDelete": false
    }, {
      "name": "rabbot-q2"
    }],
    "bindings": [{
      "exchange": "rabbot-ex-new",
      "target": "rabbot-q1",
      "keys": ["behrad.test"]
    },{
      "exchange": "rabbot-ex-new",
      "target": "rabbot-q2",
      "keys": ["behrad.*"]
    }]
  }).done( function() {
    console.log('Ready!');
    cb && cb();
  });


  ['connected', 'closed', 'failed', 'unreachable', 'error'].forEach(e => {
    rabbot.on(e, (...args) => {
      console.log(`${e} -> ${args}`)
    })
  })

  // shutdown???
}