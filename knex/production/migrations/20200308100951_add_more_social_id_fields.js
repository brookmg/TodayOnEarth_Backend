
exports.up = function(knex) {
    return knex.schema.alterTable('user' , table => {
        table.string('github_id').unique();
        table.string('linkedin_id').unique();
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('user' , table => {
        table.dropColumn('github_id');
        table.dropColumn('linkedin_id');
    });
};
