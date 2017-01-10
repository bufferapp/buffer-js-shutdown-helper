const createLogger = require('@bufferapp/logger');
const shutdownHelper = require('../../index.js')

const server = {
  close: (cb) => cb(null),
};

const shutdownDelay = process.argv[2];
const readySignal = process.argv[3];
const name = process.argv[4];

if (name) {
  const logger = createLogger({ name });
  shutdownHelper.init({ server, shutdownDelay, logger });
} else {
  shutdownHelper.init({ server, shutdownDelay });
}

// Keep process alive
setInterval(() => console.log('loop'), 50000);

console.log(readySignal);
