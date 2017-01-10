const createLogger = require('@bufferapp/logger');
const shutdownHelper = require('../../index.js')

const mockServer = {
  close: (cb) => cb(null)
}

const SHUTDOWN_DELAY = process.argv[2]
const READY_SIGNAL = process.argv[3]
const SERVICE_NAME = process.argv[4]

if (SERVICE_NAME) {
  const logger = createLogger({ name: SERVICE_NAME });
  shutdownHelper.init(mockServer, SHUTDOWN_DELAY, logger)
} else {
  shutdownHelper.init(mockServer, SHUTDOWN_DELAY)
}

// Keep process alive
setInterval(() => console.log('loop'), 50000)

console.log(READY_SIGNAL)
