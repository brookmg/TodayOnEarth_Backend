
exports.up = function(knex) {
    return knex.schema.createTable('user', table => {
        table.increments('uid').primary();

        table.string('first_name');
        table.string('middle_name');
        table.string('last_name');
        table.string('email').unique();
        table.integer('role');

        table.string('phone_number');
        table.date('last_login_time');
        table.string('username').unique();
        table.string('country');
        table.string('last_location');  // comma separated geo data
        table.string('password_hash');

        table.string('google_id').unique();
        table.string('facebook_id').unique();
        table.string('twitter_id').unique();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('user');
};
