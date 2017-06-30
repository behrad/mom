const http = require('http')
const port = 3000

let count = 1

const requestHandler = (request, response) => {
  // console.log(count++)
  response.end(JSON.stringify({ hello: 'world' }))
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  console.log(`server is listening on ${port}`)
})