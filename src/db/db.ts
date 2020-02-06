const Knex = require('knex')

// These values might change with some env values
export const KnexI = Knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'root',
        password : 'toor',
        database : 'toe'
      }
})



