exports.up = function(knex) {
    return knex.schema.createTable('provider', table => {
        table.increments('provider_id').primary();
        table.string('provider');
        table.string('source');

        table.integer('uid');
        table.dateTime('added_on');
        table.string('frequency');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('provider')
};
