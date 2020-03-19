exports.up = function(knex) {
  return knex.schema.createTable('keyword', table => {
        table.increments('keyword_id').primary();
        table.string('keyword');
        table.integer('post_id');
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('keyword')
};
