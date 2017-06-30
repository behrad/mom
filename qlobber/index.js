const bench = require('fastbench');

const Qlobber = require('qlobber').Qlobber;
const QlobberDedup = require('qlobber').QlobberDedup;

const matcher = new Qlobber({
  wildcard_one: '+',
  wildcard_some: '#',
  separator: '/'
});

const dedup = new QlobberDedup({
  wildcard_one: '+',
  wildcard_some: '#',
  separator: '/'
});

const total = 10000;
let count = 0;


function addTopics(cb) {
  let count = 0;
  for (let i = 0; i < total; i++) {
    matcher.add('app/adp-nms-push/user/behrad/'+ ++count, {name: 'asdasdsadsadsadsadsadsafsaf', count: count});
    matcher.add('app/adp-nms-push/user/public', {name: 'asdasdsadsadsadsadsadsafsaf', count: count});
  }
  cb();
}

function addTopicsDedup(cb) {
  for (let i = 0; i < total; i++) {
    dedup.add('app/adp-nms-push/user/behrad/'+ ++count, {name: 'asdasdsadsadsadsadsadsafsaf', count: count});
    dedup.add('app/adp-nms-push/user/public', {name: 'asdasdsadsadsadsadsadsafsaf', count: count});
  }
  cb();
}

function matchTopics(cb) {
  for (let i = 0; i < total; i++) {
    matcher.match('app/adp-nms-push/user/behrad/'+ ++count);
    matcher.match('app/adp-nms-push/user/public');
  }
  cb();
}

function matchTopicsDedup(cb) {
  for (let i = 0; i < total; i++) {
    dedup.match('app/adp-nms-push/user/behrad/'+ ++count);
    dedup.match('app/adp-nms-push/user/public');
  }
  cb();
}

function matchAdd(cb) {
  for (let i = 0; i < total; i++) {
    if (!matcher.match('app/adp-nms-push/user/behrad/'+ ++count)) {
      matcher.add('app/adp-nms-push/user/behrad/'+ count, {name: 'asdasdsadsadsadsadsadsafsaf', count: count});
    }
  }
  cb();
}



// bench([addTopics], 1000)()
// bench([addTopicsDedup], 1000)()

// addTopics(function(){})
// bench([matchTopics], 1000)()

// addTopicsDedup(function(){})
// bench([matchTopicsDedup], 1000)()

bench([matchAdd], 1000)()
