module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'toor',
      database : 'toe'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/knex/staging/migrations',
    },
    seeds: {
      directory: __dirname + '/knex/staging/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'toor',
      database : 'toe'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/knex/production/migrations',
    },
    seeds: {
      directory: __dirname + '/knex/production/seeds'
    }
  }

};
