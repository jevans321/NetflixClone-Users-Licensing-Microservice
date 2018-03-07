
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('regions').del()
    .then(function () {
      // Inserts seed entries
      return knex('regions').insert([
        {'ip': '123.200.14.4', 'region': 'Canada'},
        {'ip': '123.200.14.5', 'region': 'usa'},
        {'ip': '123.200.14.6', 'region': 'Brazil'}
      ]);
    });
};
// {'id': 1, 'ip': '123.200.14.4', 'region': 'Canada'},
// {'id': 2, 'ip': '123.200.14.5', 'region': 'usa'},
// {'id': 3, 'ip': '123.200.14.6', 'region': 'Brazil'}