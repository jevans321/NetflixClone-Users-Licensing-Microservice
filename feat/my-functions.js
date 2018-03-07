'use strict';
const faker = require('faker');

module.exports = {
  generateRandomData
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function generateRandomData(userContext, events, done) {
  // generate data with Faker:
  const userid = faker.random.number(10000000);
  const ip = faker.internet.ip();
  const status = faker.random.arrayElement(['Expired', 'Subscribed', 'None']);
  // add variables to virtual user's context:
  userContext.vars.ip = ip;
  userContext.vars.status = status;
  userContext.vars.userid = userid;
  // continue with executing the scenario:
  return done();
}