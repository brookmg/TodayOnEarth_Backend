
exports.up = function(knex) {
  return knex.schema.alterTable('token' , table => {
      table.text('github' , 'longtext');
      table.text('linkedin' , 'longtext');
  })
};

exports.down = function(knex) {
    return knex.schema.alterTable('token' , table => {
        table.dropColumn('github');
        table.dropColumn('linkedin');
    })
};
