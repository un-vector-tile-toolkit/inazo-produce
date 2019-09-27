const config = require('config')
const glob = require('glob')
const Queue = require('better-queue')
const Parser = require('json-text-sequence').parser
const fs = require('fs')
const modify = require('./modify.js')
const { spawn } = require('child_process')

const concurrent = config.get('concurrent')
const srcGlob = config.get('srcGlob')

const tippecanoe = spawn('tippecanoe', [
  '--no-feature-limit',
  '--no-tile-size-limit',
  '--force',
  '--minimum-zoom=2',
  '--maximum-zoom=8',
  '--base-zoom=8',
  '--hilbert',
  '--output=tiles.mbtiles'
], {
  stdio: [
    'pipe',
    'inherit',
    'inherit'
  ]
})

const queue = new Queue((path, cb) => {
  let pausing = false
  const source = fs.createReadStream(path)
  const parser = new Parser()
    .on('data', json => {
      let f = modify(json)
      if (f) {
        if (tippecanoe.stdin.write(JSON.stringify(f))) {
        } else {
          source.pause()
          if (!pausing) {
            tippecanoe.stdin.once('drain', () => {
              source.resume()
              pausing = false
            })
            pausing = true
          }
        }
      }
    })
    .on('finish', () => {
      cb()
    })
  source.pipe(parser)
}, {
  concurrent: concurrent
})
queue.on('drain', () => {
  tippecanoe.stdin.end()
})

glob(srcGlob, {}, (err, paths) => {
  for (const path of paths) {
    queue.push(path)
  }
})

