const mqtt = require("mqtt");

let client = mqtt.connect({
  host: '10.10.101.116',
  port: 1883,
  username: 'admin',
  password: 'mqadminP@ssw0rd',
  clientId: 'behradMqtt',
  clean: false
});

client.on('connect', () => {
  console.log('Connected');
  client.subscribe({
    'testQueue2': 1
  }, (err, sub) => {
    if(err) return console.error(err);
    console.log('Subscribed to ', sub);
  });
});
client.on('error', err => {
  console.log('error ', err);
});
client.on('close', reason => {
  console.log('close ', reason);
});
client.on('reconnect', () => {
  console.log('reconnect');
});

client.on('message', (topic, msg) => {
  console.log(`New message ${topic} `, msg.toString());
});



function publish() {
  client.publish('testQueue', 'Salam Azizam '+Date.now);
}


// setInterval(publish, 2000);