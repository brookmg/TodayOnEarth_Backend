
exports.up = function(knex) {
  return knex.schema.alterTable('post' , table => {
      table.text('source' , 'mediumtext');
  })
};

exports.down = function(knex) {
    return knex.schema.alterTable('post' , table => {
        table.dropColumn('source');
    })
};
