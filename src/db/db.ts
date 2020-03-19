const Knex = require('knex')

const state = process.env.NODE_ENV || 'development';
// These values might change with some env values
export const KnexI = Knex(require('../../knexfile')[state]);



