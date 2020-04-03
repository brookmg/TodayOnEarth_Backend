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
      host : 'ec2-54-247-169-129.eu-west-1.compute.amazonaws.com',
      user : 'cvpeflvmjbgelv',
      port: 5432,
      ssl: true,
      password : '8ab8114a105eaa5710ee5d12e843361bf59525196d1f042344f22bf4155f30e6',
      database : 'd51a0vs5marq9'
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
