const Knex = require('knex')

const state = process.env.NODE_ENV || 'development';

// These values might change with some env values
// This is the instance in which all models get db access from
export const KnexI = Knex(require('../../knexfile')[state]);



