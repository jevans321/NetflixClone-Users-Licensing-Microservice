// ----- Dependencies ----- //
const Router = require('koa-router');
const queries = require('../db/queries/index');
const axios = require('axios');
const faker = require('faker');
const router = new Router();
const BASE_URL = `/user`;


// ----- FUNCTION :: POST user data to Client-Facing Server ----- //
const sendUserDataToCFS = (data) => {
  axios.post('/user', data) 
  .then(function (response) {
    console.log("Axios Response: ", response);
  
  })
  .catch(function (error) {
    console.log(error);
  });
}

// ----- GET REQUEST HANDLER :: ENDPOINT /user/:userid ----- //
router.get(`${BASE_URL}/:userid`, async (ctx) => {
  // Query Redis cache first for user data
  let hashValues = await queries.hashGetValues("userid:" + ctx.params.userid);
  let hashArray = [hashValues];
  // console.log('hash vals:', hashArray);
  // if userid exists in cache send user data from cache
  if(hashArray[0]) {
    ctx.status = 200; 
    ctx.body = {
      status: 'cache get success',
      data: [{
        userId: hashArray[0].userid,
        subscriptionStatus: hashArray[0].subscriptionstatus,
        region: hashArray[0].region
      }]
    };
    // Otherwise Query PostgreSQL database for user data
  } else {
    try {
      let userData = await queries.getUserInfoForCFS(ctx.params.userid);
     // console.log('user data:.........', userData);
     // console.log('user data length:.........', userData.length);       
      if(userData.length) {
        ctx.status = 200; 
        ctx.body = {
          status: 'postgres get success',
          data: [{
            userId: userData[0].userid,
            subscriptionStatus: userData[0].subscriptionstatus,
            region: userData[0].region
          }]
        };
      } else {
        ctx.status = 404;
        ctx.body = {
          status: 'error',
          message: 'That user does not exist.'
        };
      }
    } catch (err) {
      console.log(err)
    }
  }
})

// ----- POST REQUEST HANDLER :: ENDPOINT /login ----- //
router.post('/login', async (ctx) => {
  // create Region for new User
  let region = faker.address.country();

  // If new IP does NOT exist in PostgreSQL Regions table add it
  // 1. Check if new IP exists in PG-Regions Table
  try {
    let ipExistsBody = await queries.valueExistsInPostgres(ctx.request.body.ip, 'regions', 'ip');
    let ipExists = ipExistsBody.rows[0].exists
    // console.log('IP In PG Regions Table Body: ', ipExists);
    // a. If IP does NOT exist in PG-Regions Table
    if(!ipExists) {
      // 1. Add IP & Region to PG-Regions Table
      try {
        let insertIpAndRegionResp = await queries.addIpAndRegionInRegionsTablePG(ctx.request.body.ip, region);
        console.log('postgres regions table insert success (IP and Region): ', insertIpAndRegionResp);
      } catch (err) {
        console.log('error', err);
      }
    }
  } catch (err) {
    console.log('error', err);
  }


  // If user exists (if userID exists) update Redis cache and Postgres DB
  if(ctx.request.body.userid) {
    // 1. Create existing user Object
    const existingUser = {
      userid: ctx.request.body.userid,
      region: region,
      subscriptionStatus: ctx.request.body.subscriptionstatus
    }
    //a. Send new user object to Client-Facing Server --------------- //
    sendUserDataToCFS(existingUser);

    // 2. Check if user is in Redis Cache (Can check using user ID)
    queries.hashExists("userid:" + ctx.request.body.userid, (err, body) => {
      if (err) {
        return console.log(err);
      }
      let userInCache = body;
      // a. If user EXISTS in Redis cache
      if(userInCache) {
        // 1. Update Region and Subscription Status in 'userid' cache hash (IP not necessary)
        queries.hashUpdate("userid:" + ctx.request.body.userid, region, ctx.request.body.subscriptionstatus);
        console.log('cache update success');
      // b If user does NOT exist in Redis cache
      } else {
        // 1. Add new user data to Redis Cache (user ID, subscription status, region)
        queries.hashSet("userid:" + ctx.request.body.userid, ctx.request.body.userid, ctx.request.body.subscriptionstatus, region);
        console.log('cache insert success');     
      }
    });
        
    // 3. Update/Replace IP and Subscription Status in existing PG-Users table
    try {
      let updateResp = await queries.updateIpInUsersTablePG(ctx.request.body.userid, ctx.request.body.ip, ctx.request.body.subscriptionstatus);
      console.log('Update Success (IP and Subscription Status): ', updateResp);      
      ctx.status = 200;
      ctx.body = {
        status: 'postgres update success (IP and Subscription Status)',
        data: updateResp
      };
    } catch (err) {
      console.log('error', err);
    }

  // Otherwise: If user does NOT exist
  } else {

    // 1. Store new user ID, IP, subscription status in PostgreSQL Users Table
    try {
      let addResp = await queries.addIpAndStatusInUsersTablePG(ctx.request.body.ip, ctx.request.body.subscriptionstatus);
      console.log('postgres insert success (User ID, IP, and Status)): ', addResp);
      queries.hashSet("userid:" + addResp[0].userid, addResp[0].userid, ctx.request.body.subscriptionstatus, region);  
      console.log('cache insert success');
      ctx.status = 201;
      ctx.body = {
        status: 'postgres insert success (User ID, IP, and Status)',
        data: addResp
      };
    } catch (err) {
      console.log('error', err);
    }
  }
})

module.exports = router;
