

module.exports = class Stats {

  constructor (opts = {}) {
    this.interval = (opts.interval*1000) || 2000
    this.keys = {}
    this.i = 1;
    this.start()
  }

  inc (key) {
    this.keys[key] = this.keys[key] || 0
    this.keys[key]++
  }

  start () {
    this.print()
    setTimeout(this.start.bind(this), this.interval)
  }

  print () {
    const keys = Object.keys(this.keys)
    if (keys.length === 0) {
      return;
    }
    const keyStr = keys.map(k => `${k}=${this.keys[k]}`).join(', ')
    const now = format(new Date)
    console.log(`Stats[${now}] ${keyStr} [${(this.interval/1000) * this.i++}s]`)
  }

}

function format(d) {
  return d2(d.getHours()) + ':'
    + d2(d.getMinutes()) + ':'
    + d2(d.getSeconds()) + '.'
    + d2(d.getMilliseconds())

  function d2(number) {
    return number < 10 ? '0'+number : number
  }
}