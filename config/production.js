module.exports = {
  $schema: '../schema/config.schema.json',
  mongo: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    db: process.env.DB_NAME
  },
  'web-app': {
    port: 80,
    secret: 'aNjGBJW9m7{VMqu0ANX(BOCCK-VV0!',
    'token-expires-in': '30m',
    'refresh-token-expires-in': '1d'
  },
  'base-path': '/api/v1',
  'default-admin-permissions': ['*'],
  'default-user-permissions': ['profile-view'],
  'default-role-filters': {
    student: [
      'last-login-after',
      'last-login-before',
      'login-count-greater-than',
      'signed-up-after',
      'signed-up-before'
    ],
    owner: ['last-login-after', 'last-login-before', 'login-count-greater-than', 'signed-up-after'],
    author: ['last-login-after', 'last-login-before', 'login-count-greater-than'],
    affiliate: ['last-login-after', 'last-login-before']
  }
};
