
exports.up = function(knex) {
  return knex.schema.table('token' , table => {
      table.string('google');
  })
};

exports.down = function(knex) {
    return knex.schema.table('token' , table => {
        table.dropColumn('google');
    })
};
