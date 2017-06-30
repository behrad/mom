// Require the framework and instantiate it
const fastify = require('fastify')()

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen(3001, function (err) {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})