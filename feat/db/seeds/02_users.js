
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {'subscriptionstatus': 'Expired', 'ip': '123.200.14.4'},
        {'subscriptionstatus': 'None', 'ip': '123.200.14.5'},
        {'subscriptionstatus': 'Subscribed', 'ip': '123.200.14.6'}
      ]);
    });
};
