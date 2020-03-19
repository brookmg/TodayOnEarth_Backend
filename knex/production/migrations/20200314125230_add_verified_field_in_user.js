
exports.up = function(knex) {
    return knex.schema.alterTable('user' , table => {
        table.boolean('verified').defaultTo(false);
        table.string('verification_token');
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('user' , table => {
        table.dropColumn('verified');
        table.dropColumn('verification_token');
    });
};
