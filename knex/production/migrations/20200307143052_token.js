
exports.up = function(knex) {
    return knex.schema.createTable('token', table => {
        table.increments('id').primary();

        table.integer('uid').unique();
        table.string('facebook');
        table.string('twitter');
        table.string('instagram');
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('token')
};
