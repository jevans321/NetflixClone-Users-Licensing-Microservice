
## Command Line Commands

### Start Server
Start Server
$ npm start

### Run Data Generator
Run
$ node dataGen.js
Run with 8 Gigs max space
$ node --max-old-space-size=8192 dataGen.js

### Knex Migration
Apply migration to databases (Add tables)
$ knex migrate:latest --env development
$ knex migrate:latest --env test

Populate databases with data from seed files
$ knex seed:run --env development
$ knex seed:run --env test

Rollback
$ knex migrate:rollback --env development
$ knex migrate:rollback --env test

DELETE FROM knex_migrations_lock;
## Knex on EC2
Knex needs to be installed Globally

### Start PostgreSQL
Start PostgreSQL Server:
$ postgres -D /usr/local/var/postgres
Stop:
$ pg_ctl -D /usr/local/var/postgres stop

Start psql - postgres command line http://postgresguide.com/utilities/psql.html
$ psql -h localhost -U username databasename

## EC2: Start PostgreSQL
$ psql "dbname=user_region host=capstone-10m-user-license.cru82avnxkng.us-west-1.rds.amazonaws.com user=jamesw85 password=#### port=5432 sslmode=require"

test query time
\timing
Query: 'select * from table where columnName = value;'

## Add Index Postgres
CREATE INDEX users_userid_index ON users (userid);
removed: CREATE INDEX regions_region_index ON regions (region);
CREATE INDEX users_ip_index ON users (ip);
CREATE INDEX regions_ip_index ON regions (ip);

Remove Index:
DROP INDEX title_idx;

## Delete rows Postgres
DELETE FROM users WHERE userid > 10000000;

Get table count
SELECT count(*) AS exact_count FROM users;

IP Exists?
select exists(SELECT ip FROM regions WHERE ip = inet '157.237.233.154');

## Inner Join Users/Regions table:
SELECT users.userid, users.subscriptionstatus, regions.region FROM users INNER JOIN regions ON users.ip = regions.ip WHERE 2 = users.userid;

import Schema .sql file
\i ~/desktop/schema.sql

Quit
\q
    
## Start Redis
Start Redis Server
$ redis-server

Start Redis CLI - command line
$ redis-cli

Delete hash
IP:Port> del myhash

### EC2 Redis Connect
$ telnet redis4-001.lqqhem.0001.usw1.cache.amazonaws.com 6379
Must be in parent directory of 'src' folder below to use command
$ src/redis-cli -c -h redis4-001.lqqhem.0001.usw1.cache.amazonaws.com -p 6379

### Artillery
$ artillery quick --count 1 -n 3 http://localhost:1337/user/1
$ artillery quick --count 1 -n 1 http://ec2-52-53-209-88.us-west-1.compute.amazonaws.com:1337/user/1

$ artillery run artillery.yml


    
