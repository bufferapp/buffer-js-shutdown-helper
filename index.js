let isShutingDown = false;

const logMessage = (logger, message) => {
  if (logger) {
    logger.info({}, message);
  } else {
    console.log(message);
  }
};

/**
 * init
 * Listen to the SIGTERM signal and shutdown the given server after a given delay in seconds
 *
 * @param {http.Server} server
 * @param {Integer} shutdownDelay
 * @param {@bufferapp/logger} logger
 */
module.exports.init = (server, shutdownDelay = 20, logger = null) => {
  const READINESS_PROBE_SHUTDOWN_DELAY = shutdownDelay * 1000;

  process.on('SIGTERM', () => {
    logMessage(logger, 'SIGTERM received - Starting graceful shutdown');

    isShutingDown = true;

    setTimeout(() => {
      server.close(err => {
        if (err) {
          logMessage(logger, `Express app shutdown error, ${err}`);
          process.exit(1);
        }
        logMessage(logger, 'Express app shutdown success');
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
