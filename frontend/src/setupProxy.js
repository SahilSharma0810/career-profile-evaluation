// Local dev proxy: forward backend API calls to Scaler staging.
// Only used by `npm start`; production build is served from the same origin
// as the API and does not use this file.

const { createProxyMiddleware } = require('http-proxy-middleware');

const TARGET = process.env.REACT_APP_API_PROXY_TARGET || 'https://8.staging.sclr.ac';

const proxyPaths = [
  '/users',
  '/api',
  '/csrf-token',
  '/generate-jwt',
  '/career-profile-tool/api'
];

module.exports = function (app) {
  proxyPaths.forEach((path) => {
    app.use(
      path,
      createProxyMiddleware({
        target: TARGET,
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost',
        logLevel: 'debug',
        onProxyReq: (proxyReq) => {
          // Make staging see the request as if it originated from itself —
          // browsers refuse to let us override Referer/Origin client-side, so
          // we rewrite at the proxy hop instead. Keeps CSRF/session checks happy.
          proxyReq.setHeader('Origin', TARGET);
          proxyReq.setHeader('Referer', `${TARGET}/`);
        }
      })
    );
  });
};
