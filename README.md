# @bufferapp/shutdown-helper

[![NPM Version](https://img.shields.io/npm/v/@bufferapp/shutdown-helper.svg)](https://www.npmjs.com/package/@bufferapp/shutdown-helper)
[![Build Status](https://travis-ci.org/bufferapp/node-shutdown-helper.svg?branch=master)](https://travis-ci.org/bufferapp/node-shutdown-helper)

Provides a basic helper that listens to the `SIGTERM` signal and will shutdown the given
[Express.js](http://expressjs.com/) server after the given delay in seconds.

## Install

```
npm install @bufferapp/shutdown-helper -SE
```

**Note** - This package requires [`@bufferapp/logger`](https://github.com/bufferapp/node-logger)
as a peer dependency.

## Usage

To use with your Express.js app, you'll have to use Node's `http` package to start your server.
Here is a full usage example:

```js
const http = require('http')
const express = require('express')
const shutdownHelper = require('@bufferapp/node-shutdown-helper')

const SERVICE_NAME = 'Images-Worker'
const SHUTDOWN_DELAY = 20 // seconds

const app = express()
const server = http.createServer(app)

server.listen(8080)

shutdownHelper.init(SERVICE_NAME, server, SHUTDOWN_DELAY)
```

The `init` function takes three arguments:

- `name` (*String*) - The service name to use for logging the shutdown messages
- `server` ([*http.Server*](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_class_http_server)) -
  An instance of a Node http server
- `shutdownDelay` (*Integer*) - The delay in seconds after which to shut down the http server. Default `20` seconds.

Elsewhere in your application, ideally in a health-check endpoint, you can use the `isShutingDown`
function to check if your application has received a `SIGTERM`:

```js
const { isShutingDown } = require('@bufferapp/node-shutdown-helper')

app.get('/health-check', (req, res) => {
  const code = isShutingDown() ? 500 : 200
  const status = code === 200 ? 'awesome' : 'shutting down'
  res.status(code).json({ status })
})
```
