const msgpack = require('msgpack-lite')
const bench = require('fastbench')
const Redis = require('ioredis')
const shortid = require('shortid')
const LRU = require('lru-cache')

const cache = LRU({
  max: 10000,
  maxAge: 60 * 1000 // one minute
})


const db = new Redis()

const msg = {
  content: "⚽️ باز هم پیش‌بینی لیگ... ⚽️ باز هم هیجان... ⚽️ باز هم نود...",
  data: {
    html: "<p dir='rtl' style='text-align:center'><img alt='' src='https://goo.gl/z0Cm2k' style='height:50px; width:50px'><br>با به روز رسانی به نسخه جدید (۳.۰.۱) بازی تیم محبوب خود را سریع&zwnj;تر پیش&zwnj;بینی کنید و هر هفته&zwnj;ی لیگ با نودی&zwnj;ها رقابت کنید.</p><p dir='rtl' style='text-align:center'>⚽️&nbsp;<a href='https://play.google.com/store/apps/details?id=com.adpdigital.navad&amp;hl=en'><span style='color:rgb(0, 100, 0)'><span style='font-size:16px'><u><strong>لینک دانلود از گوگل پلی</strong></u></span></span></a><span style='font-size:12px'><strong><span style='font-size:14px'>&nbsp;</span></strong></span>⚽️<br><br>⚽️&nbsp;<a href='https://cafebazaar.ir/app/com.adpdigital.navad/?l=fa'><span style='color:rgb(0, 100, 0)'><span style='font-size:16px'><u><strong>لینک دانلود از کافه بازار</strong></u></span></span></a><span style='font-size:12px'><strong><span style='font-size:14px'>&nbsp;</span></strong></span>⚽️</p>"
  }
}

const msg2 = {
  content: 'Salam behrad jan omidvaram khoob bashi!',
  user: '989125336383',
  topic: 'default'
}


function test (cb) {
  cb && cb(null, msgpack.encode(msg))
}

function hset (i, data, cb) {
  db.mset('testKey_'+i, data, 'test_'+i, 1, cb)
}

let count = 0

function finish() {
  if (++count === 10000) {
    done()
  }
}

function id (cb) {
  shortid()
  cb && cb()
}

function cachetest (cb) {
  const id = Date.now()
  if (!cache.get(id)) {
  }
  cache.set(id, true)
  cb && cb()
}

function done () {
  console.timeEnd('msgPack')
}

console.time('msgPack')
for (let i = 0; i < 10000; i++) {
  (function (i) {


    cachetest(finish)

    // id(finish)

    // test( (err, buf) => {
    //   hset(i, buf, finish)
    // })
  })(i)
}