const createLogger = require('@bufferapp/logger');

let isShutingDown = false;

/**
 * init
 * Listen to the SIGTERM signal and shutdown the given server after a given delay in seconds
 *
 * @param {String} name
 * @param {http.Server} server
 * @param {Integer} shutdownDelay
 */
module.exports.init = (name, server, shutdownDelay = 20) => {
  const READINESS_PROBE_SHUTDOWN_DELAY = shutdownDelay * 1000;
  const logger = createLogger({ name });

  process.on('SIGTERM', () => {
    logger.info({}, 'SIGTERM received - Starting graceful shutdown');

    isShutingDown = true;

    setTimeout(() => {
      server.close(err => {
        if (err) {
          logger.info({}, `Express app shutdown error, ${err}`);
          process.exit(1);
        }
        logger.info({}, 'Express app shutdown success');
        process.exit();
      });
    }, READINESS_PROBE_SHUTDOWN_DELAY);
  });
};

/**
 * isShutingDown
 * Return if the process has received the signal to shut down.
 *
 * @return {Boolean}
 */
module.exports.isShutingDown = () => isShutingDown;
