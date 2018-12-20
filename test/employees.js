require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('session auth app', () => {
  zapier.tools.env.inject();

  it('employee resource can list', (done) => {
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
        appTester(App.resources.employees.list.operation.perform, bundle2)
          .then((response) => {
            response.status.should.eql(200);
            done();
          })
          .catch(done);
      })
      .catch(done);
  });

  it('employee resource can search', (done) => {
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
          inputData: {
            query: '{"email": "o.saintgermain@gmail.com"}',
          }
        };
        appTester(App.resources.employees.search.operation.perform, bundle2)
          .then((response) => {
            response.json.length.eql(1);
            response.status.should.eql(200);
            done();
          })
          .catch(done);
      })
      .catch(done);
  });

  it.only('employee resource can get', (done) => {
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
          inputData: {
            id: '58cacbbca932d100111fd91a',
          }
        };
        appTester(App.resources.employees.get.operation.perform, bundle2)
          .then((response) => {
          console.log(response.json);
            response.json.id.eql('58cacbbca932d100111fd91a');
            response.status.should.eql(200);
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
});
