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
      host : 'ec2-46-137-124-19.eu-west-1.compute.amazonaws.com',
      user : 'mrcjhoflxlgwvd',
      port: 5432,
      ssl: true,
      password : 'c55ff55b1d6f52ef015eb15fba7b3a1d0e58b626d0891e08ed07095bfccc87c9',
      database : 'd1mf9391m7eiha'
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
