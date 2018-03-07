const path = require('path');

const BASE_PATH = path.join(__dirname, 'feat', 'db');

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://jamesw85:'+ process.env.pg_pw +'@capstone-10m-user-license.cru82avnxkng.us-west-1.rds.amazonaws.com:5432/user_region_test',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },
  development: {
    client: 'pg',
    connection: 'postgres://jamesw85:'+ process.env.pg_pw +'@read.db.local:5432/user_region',
   // connection: 'postgres://jamesw85:'+ process.env.pg_pw +'@capstone-10m-user-license.cru82avnxkng.us-west-1.rds.amazonaws.com:5432/user_region',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};
