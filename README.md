# NetflixClone- Users & Licensing Microservice
This is a back-end System Design project of a Netflix-Clone Application. I created a microservice that assigns regions for each user based on their IP address and stores the users account data to a PostgreSQL database. 10 million records were added to the database and the database queries were optimized.

![alt text](https://github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/users_microservice_jamesevans4.png)

### Deployment:
**Amazon Web Services**<br/>
* EC2: Node Server with Koa framework<br/>
* RDS: PostgreSQL Database<br/>
* Elasticache: Redis cache<br/>

### Tech Stack:
* Node.JS<br/>
* Koa<br/>
* Knex<br/>
* PostgreSQL Database<br/>
* Redis Cache<br/>
* Mocha / Chai<br/>
* Artillery<br/>
* New Relic<br/>
* Axios

### Database Schema (Knex syntax):
[github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/feat/db/migrations/20180214033316_create_users_and_regions_tables.js](https://github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/feat/db/migrations/20180214033316_create_users_and_regions_tables.js)

### Database Queries:
[github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/feat/db/queries/index.js
](https://github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/feat/db/queries/index.js)

### API Calls:
[github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/feat/routes/index.js
](https://github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/feat/routes/index.js)

### Unit Testing:
**Mocha / Chai**<br/>
[github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/test/routes.index.test.js](https://github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/test/routes.index.test.js)

### Load Testing:
* New Relic<br/>
* Artillery<br/>
[github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/feat/artillery.yml](https://github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/feat/artillery.yml)

### Data Generation Script
[github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/feat/dataGen.js](https://github.com/jevans321/NetflixClone-Users-Licensing-Microservice/blob/master/feat/dataGen.js)

### Data Flow
### /login endpoint
When a user logs into the app, a POST request is sent from the /login endpoint to the User & Licensing Service.
The POST request contains the users info: Client IP address and subscription status.
A country region is generated based on the IP address. The users info is stored in a postgreSQL database and a Redis cache.

A POST request is then sent from this User & Licensing microervice to the Client Facing Server.
The POST request contains the user ID, region, and subscription status.
This data is retrieved from the Redis cache if available. Otherwise it is retrieved from the postgreSQL database.

### /user/:userid endpoint
If a user data cache miss occurs in the Client Facing Server:
A GET request is made for user data by the Client Facing Server to the User & Licensing Service
The data requested is the user ID, region, and subscription status
The User & Licensing Service responds with the requested user data


