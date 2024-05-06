'use strict';

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, './../../../../../.env'),
});

module.exports = function (ctx, req, res) {
  if (req.url === '/$config') {
    return res({
      headers: {
        'content-type': 'application/json',
      },
      content: JSON.stringify({
        tenantId: process.env.TENANT_ID,
        environmentId: process.env.ENVIRONMENT_ID,
        microFrontendServiceEndpoint:
          process.env.MICRO_FRONTEND_SERVICE_BASE_URL,
        idServiceAuthEndpoint: `http://localhost:${process.env.ID_SERVICE_LOCAL_PROXY_PORT}`,
      }),
    });
  }
};
