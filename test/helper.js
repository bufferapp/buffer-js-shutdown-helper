const assert = require('assert');
const { spawn } = require('child_process');

const log = (...args) => console.log.apply(null, args);

describe('helper', function() {
  this.timeout(10000);

  it('should exit correctly on SIGTERM', (done) => {
    const READY_SIGNAL = 'ready';
    const mockServer = spawn('node', [
      './test/mock/server.js',
      'Test-App',
      0,
      READY_SIGNAL
    ]);

    mockServer.on('close', (code, signal) => {
      assert.equal(code, 0, `Child process should exit with code 0. Exited with "${code}"`);
      done();
    });

    // Kill the process when it's signaled it's ready
    mockServer.stdout.on('data', data => {
      const msg = data.toString().trim();
      if (msg == READY_SIGNAL) {
        mockServer.kill();
      }
    });

    mockServer.stderr.on('data', data => log(`stderr: ${data}`));
  });

  it('should log twice on shutdown', (done) => {
    const APP_NAME = 'Test-App';
    const READY_SIGNAL = 'ready';
    const mockServer = spawn('node', [
      './test/mock/server.js',
      APP_NAME,
      0,
      READY_SIGNAL
    ]);
    let msgsLogged = 0;

    mockServer.on('close', (code, signal) => {
      assert.equal(msgsLogged, 2, `Should have recieved 2 shutdown messages. Recieved ${msgsLogged}`);
      done();
    });

    // Kill the process when it's signaled it's ready
    mockServer.stdout.on('data', data => {
      const msg = data.toString().trim();
      if (msg == READY_SIGNAL) {
        mockServer.kill();
      } else if (msg.match(APP_NAME)) {
        msgsLogged++;
      }
    });

    mockServer.stderr.on('data', data => log(`stderr: ${data}`));
  });

  it('should delay given number of seconds', (done) => {
    const APP_NAME = 'Test-App';
    const SHUTDOWN_DELAY = 1;
    const READY_SIGNAL = 'ready';
    const mockServer = spawn('node', [
      './test/mock/server.js',
      APP_NAME,
      SHUTDOWN_DELAY,
      READY_SIGNAL
    ]);
    let signalTime = null;

    mockServer.on('close', (code, signal) => {
      const shutdownTime = new Date();
      const actualDelay = shutdownTime - signalTime;
      assert(actualDelay >= SHUTDOWN_DELAY * 1000,
        `Should have correct delay. Got ${actualDelay}, expected ${SHUTDOWN_DELAY * 1000}`);
      done();
    });

    // Kill the process when it's signaled it's ready
    mockServer.stdout.on('data', data => {
      const msg = data.toString().trim();
      if (msg == READY_SIGNAL) {
        mockServer.kill();
        signalTime = new Date();
      }
    });

    mockServer.stderr.on('data', data => log(`stderr: ${data}`));
  });

});
