const Stats = require('./../stats')
const s = new Stats()

setInterval( () => {
  s.inc('Connected')
  s.inc('Errors')
}, 3000)