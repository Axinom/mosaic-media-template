/* eslint-disable no-console */
'use strict';

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, './../../../../../.env'),
});

module.exports = function(_ctx, _req, _res) {
  // request handler is not used
};

if (global.ID_PROXY_RUNNING === true) {
  return;
} else {
  global.ID_PROXY_RUNNING = true;

  startProxy().catch((error) => {
    console.error({
      context: 'id-proxy-injector',
      message: 'terminating id-proxy due to an unhandled exception.',
      details: error,
    });
  });
}

async function startProxy() {
  const http = require('http');
  const httpProxy = require('http-proxy');

  const proxyPort = process.env.ID_SERVICE_LOCAL_PROXY_PORT;

  const proxy = httpProxy.createProxyServer();
  const server = http.createServer((req, res) => {
    proxy.web(
      req,
      res,
      {
        xfwd: true,
        target: process.env.ID_SERVICE_AUTH_BASE_URL,
        changeOrigin: true,
      },
      (error) => {
        console.log({
          context: 'id-proxy-injector',
          message: 'an exception occured while proxying, please try again.',
          details: error,
        });
      },
    );
  });

  server.on('listening', () => {
    console.log(`\n> id-proxy running at http://localhost:${proxyPort}`);
  });

  server.listen(proxyPort);
}
