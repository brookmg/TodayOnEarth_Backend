
exports.up = function(knex) {
    return knex.schema.createTable('interest', table => {
        table.increments('interest_id').primary();

        table.string('interest');
        table.float('score');
        table.integer('uid');
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('interest')
};
