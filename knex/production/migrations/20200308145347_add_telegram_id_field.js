
exports.up = function(knex) {
    return knex.schema.alterTable('user' , table => {
        table.string('telegram_id').unique();
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('user' , table => {
        table.dropColumn('telegram_id');
    });
};
