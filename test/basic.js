require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('session auth app', () => {
  zapier.tools.env.inject();

  it('has an exchange for username/password', (done) => {
    const bundle = {
      authData: {
        username: process.env.PAYFIT_LOGIN,
        password: process.env.PAYFIT_PASSWORD,
      },
    };

    appTester(App.authentication.sessionConfig.perform, bundle)
      .then((newAuthData) => {
        newAuthData.should.have.property('updatedAccess');
        done();
      })
      .catch(done);
  });

  it('has auth details added to every request', (done) => {
    const bundle = {
      authData: {
        username: process.env.PAYFIT_LOGIN,
        password: process.env.PAYFIT_PASSWORD,
      },
    };

    appTester(App.authentication.sessionConfig.perform, bundle)
      .then((authData) => {
        const bundle2 = {
          authData,
        };
        appTester(App.authentication.test, bundle2)
          .then((response) => {
            response.status.should.eql(200);
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
});
