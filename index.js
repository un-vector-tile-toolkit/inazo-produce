const config = require('config')
const glob = require('glob')
const Queue = require('better-queue')

const concurrent = config.get('concurrent')
const srcGlob = config.get('srcGlob')

const queue = new Queue((file, cb) => {
  console.log(file)
  cb()
}, {
  concurrent: concurrent
})
queue.on('drain', () => {
  console.log('good bye')
})

glob(srcGlob, {}, (err, files) => {
  for (const file of files) {
    queue.push(file)
  }
})

