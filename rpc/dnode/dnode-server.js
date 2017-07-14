const dnode = require('dnode');
const server = dnode({
  transform : function (s, cb) {
    cb(s.replace(/[aeiou]{2,}/, 'oo').toUpperCase())
  }
});
server.listen(5004);