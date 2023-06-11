const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
};

export default routes;
