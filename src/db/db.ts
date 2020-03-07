const Knex = require('knex')

const state = process.env.ENVIRONMENT || 'development';
// These values might change with some env values
export const KnexI = Knex(require('../../knexfile')[state]);



