// const express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());

// app.use('/dialogflow', createProxyMiddleware({
//   target: 'https://api.api.ai',
//   changeOrigin: true,
//   pathRewrite: {
//     '^/dialogflow': '/v1/query?v=20150910',
//   },
// }));

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;

var originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
var originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);
function parseEnvList(env) {
  if (!env) {
    return [];
  }
  return env.split(',');
}

var checkRateLimit = require('./lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT);

var cors_proxy = require('./lib/cors-anywhere');
cors_proxy.createServer({
  originBlacklist: originBlacklist,
  originWhitelist: originWhitelist,
  requireHeader: ['origin', 'x-requested-with'],
  checkRateLimit: checkRateLimit,
  removeHeaders: [
    'cookie',
    'cookie2',
    'x-request-start',
    'x-request-id',
    'via',
    'connect-time',
    'total-route-time',
  ],
  setHeaders: {
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, charset'
  },
  redirectSameOrigin: true,
  httpProxyOptions: {
    xfwd: false,
  },
}).listen(port, host, function() {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});
