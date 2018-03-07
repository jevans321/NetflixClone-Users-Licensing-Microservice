
exports.up = function(knex, Promise) {
  return knex.schema.createTable('regions', function(table) {
    table.increments();
    table.specificType('ip', 'inet').notNullable();
    table.string('region').notNullable();
  })
  .createTable('users', function(table) {
    table.increments('userid');
    table.string('subscriptionstatus').notNullable();
    table.specificType('ip', 'inet').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users').dropTable('regions');
};
  // table.specificType('ip', 'inet').notNullable().unique();
  // table.specificType('ip', 'inet').references('ip').inTable('regions');
