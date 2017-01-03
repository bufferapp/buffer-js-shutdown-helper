const shutdownHelper = require('../../index.js')

const mockServer = {
  close: (cb) => cb(null)
}

const SERVICE_NAME = process.argv[2]
const SHUTDOWN_DELAY = process.argv[3]
const READY_SIGNAL = process.argv[4]

shutdownHelper.init(SERVICE_NAME, mockServer, SHUTDOWN_DELAY)

// Keep process alive
setInterval(() => console.log('loop'), 50000)

console.log(READY_SIGNAL)
