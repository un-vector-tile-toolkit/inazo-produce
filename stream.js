const config = require('config')
const glob = require('glob')
const Queue = require('better-queue')
const Parser = require('json-text-sequence').parser
const fs = require('fs')
const modify = require('./modify.js')

const concurrent = config.get('concurrent')
const srcGlob = config.get('srcGlob')

glob(srcGlob, {}, (err, paths) => {
  for (const path of paths) {
    const parser = new Parser()
      .on('data', f => {
        f = modify(f)
        if (f) console.log(JSON.stringify(f))
      })
    fs.createReadStream(path).pipe(parser)
  }
})

