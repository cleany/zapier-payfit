const authentication = require('./authentication');
const cookie = require('cookie');
const employees = require('./resources/employees');

// To include the session key header on all outbound requests, simply define a function here.
// It runs runs before each request is sent out, allowing you to make tweaks to the request in a centralized spot
const includeSessionKeyHeader = (request, z, bundle) => {
  if (bundle.authData.updatedAccess) {
    request.headers = request.headers || {};
    request.headers.Cookie = cookie.serialize(
      'access',
      bundle.authData.updatedAccess,
    );
  }
  return request;
};

// If we get a response and it is a 401, we can raise a special error telling Zapier to retry this after another exchange.
const sessionRefreshIf401 = (response, z, bundle) => {
  if (bundle.authData.updatedAccess) {
    if (response.status === 401) {
      throw new z.errors.RefreshAuthError('Cookie needs refreshing.');
    }
  }
  return response;
};

const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  beforeRequest: [includeSessionKeyHeader],

  afterResponse: [sessionRefreshIf401],

  resources: {
    employees,
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {},

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {},
};

// Finally, export the app.
module.exports = App;
