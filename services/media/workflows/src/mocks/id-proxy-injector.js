/* eslint-disable no-console */
'use strict';

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, './../../../../../.env'),
});

module.exports = function (_ctx, _req, _res) {
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
  const target = process.env.ID_SERVICE_AUTH_BASE_URL;

  const proxy = httpProxy.createProxyServer();
  const handleRequest = (req, res) => {
    proxy.web(
      req,
      res,
      {
        xfwd: true,
        target,
        changeOrigin: true,
      },
      (error) => {
        console.log({
          context: 'id-proxy-injector',
          message: 'an exception occured while proxying, please try again.',
          details: error,
        });

        // Otherwise the socket stays open and the browser hangs.
        if (!res.headersSent) {
          res.writeHead(502, { 'content-type': 'application/json' });
        }
        res.end(
          JSON.stringify({
            error: 'id-proxy could not reach the id service',
            target,
            details: error?.message ?? String(error),
          }),
        );
      },
    );
  };

  // Loopback only — `listen(port)` alone would bind every interface — but both
  // families, since `localhost` resolves to ::1 before 127.0.0.1. A failed bind
  // is logged, not thrown: one family is enough to work.
  const listen = (host) =>
    http
      .createServer(handleRequest)
      .on('error', (e) => console.log(`> id-proxy: no ${host} — ${e.message}`))
      .listen(proxyPort, host);

  listen('127.0.0.1');
  listen('::1');

  console.log(`\n> id-proxy running at http://localhost:${proxyPort}`);
}
