// ----- Dependencies ----- //
const knex = require('../connection');
const redis = require('redis');
//const client = redis.createClient(6379, '127.0.0.1', {no_ready_check: true});
const client = redis.createClient(6379, process.env.redis_host, {no_ready_check: true});
const {promisify} = require('util');
const hgetallAsync = promisify(client.hgetall).bind(client);


// ---- REDIS CONNECT -------- //
client.on('connect', function() {
  console.log('Connected to Redis');
});



module.exports = {

  // ----- PostgresSQL Queries ---------------------- //

  addIpAndRegionInRegionsTablePG: (ipParam, regionParam) => {
    return knex('regions')
    .returning(['id', 'ip', 'region'])
    .insert({ip: ipParam, region: regionParam})
  },

  addIpAndStatusInUsersTablePG: (ipParam, statusParam) => {
    return knex('users')
    .returning(['userid', 'ip', 'subscriptionstatus'])
    .insert({ip: ipParam, subscriptionstatus: statusParam})
  },

  updateIpInUsersTablePG: (useridParam, ipParam, statusParam) => {
    return knex('users')
    .where('userid', useridParam)
    .update({'ip': ipParam, 'subscriptionstatus': statusParam})
  },
  
  getUserInfoForCFS: (userIdParam) => {
    return knex('users')
    .join('regions', 'users.ip', '=', 'regions.ip')
    .select('users.userid', 'users.subscriptionstatus', 'regions.region')
    .where('users.userid', userIdParam)
  },

  valueExistsInPostgres: (value, table, column) => {
    let inner = knex(table).select(column).where(column, value);
    return knex.raw(inner)
    .wrap('select exists (', ')');
  },


  // ----- Redis Queries ------------------------- //

  hashSet: (hashName, idVal, statusVal, regionVal) => {
    client.HMSET(hashName, {'userid': idVal, 'subscriptionstatus': statusVal, 'region': regionVal}, redis.print);
    client.EXPIRE(hashName, 1800); // 1 hour (3600)
    
  },
  hashUpdate: (hashName, regionVal, statusVal) => {
    client.HMSET(hashName, {'region': regionVal, 'subscriptionstatus': statusVal}, redis.print);
  },

  hashGetValues: (hashName) =>{
    return hgetallAsync(hashName).then(function(res) {
      return res;
    });
  },
  
  hashExists: (hashName) => {
    client.EXISTS(hashName, (err, reply) => {
      if(err) {
        console.log(err);
      } else {
        reply === 1 ? callback(err, true) : callback(err, false);
      }
    });
  }
}
