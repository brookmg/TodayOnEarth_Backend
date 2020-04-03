
exports.up = function(knex) {
  return knex.schema.createTable('post', table => {
      table.increments('postid').primary();

      table.text('title', 'longtext');
      table.text('body', 'longtext');
      table.text('provider', 'longtext');
      table.text('source_link', 'mediumtext').unique();

      table.dateTime('published_on');
      table.dateTime('scraped_on');

      table.text('metadata', 'longtext');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('post')
};
