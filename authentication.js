const cookie = require('cookie');

const testAuth = async (z) => {
  const response = await z.request({
    method: 'POST',
    url: 'https://api.payfit.com/hr/settings',
    headers: {
      Accept: 'application/json',
      'content-type': 'application/json;charset=UTF-8',
    },
  });

  if (response.status === 401) {
    throw new Error('Cookie you supplied is invalid');
  }
  return response;
};

const getSessionKey = async (z, bundle) => {
  const data = {};

  const signinResponse = await z.request({
    method: 'POST',
    url: 'https://api.payfit.com/auth/signin',
    body: {
      email: bundle.authData.username,
      language: 'fr',
      password: bundle.authData.password,
      s: '',
      username: bundle.authData.username,
    },
    headers: {
      Accept: 'application/json',
      'content-type': 'application/json;charset=UTF-8',
    },
  });

  if (signinResponse.status === 401) {
    throw new Error('The username/password you supplied is invalid');
  }
  const signinCookie = cookie.parse(signinResponse.getHeader('set-cookie'));

  data.signinAccess = signinCookie.access;
  data.companyId = signinResponse.json.accounts[0].id;
  data.companyName = signinResponse.json.accounts[0].company;
  data.absoluteMonth = signinResponse.json.accounts[0].absoluteMonth;

  const updateResponse = await z.request({
    redirect: 'manual',
    method: 'GET',
    url: `https://api.payfit.com/auth/updateCurrentAccount?companyId=${
      data.companyId
    }`,
    headers: {
      Cookie: cookie.serialize('access', data.signinAccess),
      Accept: 'application/json',
      'content-type': 'application/json;charset=UTF-8',
    },
  });

  const updatedCookie = cookie.parse(updateResponse.getHeader('set-cookie'));
  if (updateResponse.status >= 400) {
    throw new Error('Something went wrong');
  }
  data.updatedAccess = updatedCookie.access;

  return data;
};

module.exports = {
  type: 'session',
  // Define any auth fields your app requires here. The user will be prompted to enter this info when
  // they connect their account.
  fields: [
    { key: 'username', label: 'Username', required: true, type: 'string' },
    { key: 'password', label: 'Password', required: true, type: 'password' },
  ],
  // The test method allows Zapier to verify that the credentials a user provides are valid. We'll execute this
  // method whenver a user connects their account for the first time.
  test: testAuth,
  // The method that will exchange the fields provided by the user for session credentials.
  sessionConfig: {
    perform: getSessionKey,
  },
  // assuming "username" is a key returned from the test
  connectionLabel: '{{username}}',
};
