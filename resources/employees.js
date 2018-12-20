const sample = {
  id: 'XXXXXXXXXXXXXXXXXXXXXXXX',
  absoluteMonth: 48,
  companyId: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  companyName: 'Cleany',
  firstName: 'Sébastien',
  lastName: 'Boulle',
  fullName: 'Sébastien Boulle',
  isOnboarded: true,
  avatar: '',
  jobName: 'Directeur informatique CTO',
  gender: 'M',
  matricule: null,
  analyticCode: 'RD',
  modules: {
    ticking: { enabled: false },
    expenses: { enabled: true },
  },
  status: {
    id: 'ACTIVE',
    isActive: true,
    isPending: false,
    startContract: '01/04/2017',
    endContract: null,
    flag: 'ACTIVE',
    flagMessage: null,
  },
  email: 'sebastien@cleany.fr',
  socialSecurityNumber: 'XXXXXXXXXXXXXXX',
};

const listEmployees = async (z, bundle) => {
  const response = await z.request({
    url: 'https://api.payfit.com/hr/employees',
    method: 'POST',
    body: {
      absoluteMonth: bundle.authData.absoluteMonth,
    },
  });

  if (response.status !== 200) {
    throw new Error(response.content);
  }

  return response.json;
};

const getEmployee = async (z, bundle) => {
  const response = await z.request({
    url: 'https://api.payfit.com/hr/employees',
    method: 'POST',
    body: {
      absoluteMonth: bundle.authData.absoluteMonth,
    },
  });

  if (response.status !== 200) {
    throw new Error(response.content);
  }

  return response.json.find((employee) => {
    return employee.id === bundle.inputData.id;
  });
};

const searchEmployees = async (z, bundle) => {
  const response = await z.request({
    url: 'https://api.payfit.com/hr/employees',
    method: 'POST',
    body: {
      absoluteMonth: bundle.authData.absoluteMonth,
    },
  });

  if (response.status !== 200) {
    throw new Error(response.content);
  }
  const query = z.JSON.parse(bundle.inputData.query);

  return response.json.filter((employee) => {
    return Object.keys(query).reduce((acc, key) => {
      return acc && employee[key] === query[key];
    }, true);
  });
};

module.exports = {
  key: 'employee',
  noun: 'Employee',

  get: {
    display: {
      label: 'Get Employee',
      description: 'Gets an employee.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getEmployee,
      sample: sample,
    },
  },

  list: {
    display: {
      label: 'New Employee',
      description: 'Trigger when a new employee is added.',
    },
    operation: {
      perform: listEmployees,
      sample: sample,
    },
  },

  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find Document',
      description: 'Finds an existing document by name.',
    },
    operation: {
      inputFields: [{ key: 'query', required: true }],
      perform: searchEmployees,
      sample: sample,
    },
  },

  // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
  // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
  // returned records, and have obviously dummy values that we can show to any user.
  sample: sample,

  outputFields: [],
};
