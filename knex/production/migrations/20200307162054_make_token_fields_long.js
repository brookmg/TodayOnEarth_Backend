
exports.up = function(knex) {
  return knex.schema.alterTable('token' , table => {
      table.text('google' , 'longtext').alter();
      table.text('facebook' , 'longtext').alter();
      table.text('twitter' , 'longtext').alter();
      table.text('instagram' , 'longtext').alter();
  })
};

exports.down = function(knex) {
    return knex.schema.alterTable('token' , table => {
        table.string('google').alter();
        table.string('facebook').alter();
        table.string('twitter').alter();
        table.string('instagram').alter();
    })
};
