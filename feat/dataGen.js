const pg = require('pg');
const faker = require('faker');
const pgp = require('pg-promise')({
    capSQL: true // generate capitalized SQL 
});
const Koa = require('koa');

const app = new Koa();

app.listen(4141, () => {
  console.log(`Server listening on port: 4141`);
});

// Creating a reusable / static ColumnSet for generating INSERT queries:    
 const cs = new pgp.helpers.ColumnSet([
    'ip',
    'subscriptionstatus'
    ], {table: 'users'});

const cs2 = new pgp.helpers.ColumnSet([
    'ip',
    'region'
    ], {table: 'regions'});

const cn = {
    host: 'capstone-10m-user-license.cru82avnxkng.us-west-1.rds.amazonaws.com',
    port: 5432,
    database: 'user_region',
    user: 'jamesw85',
    password: process.env.pg_pw
  };

const db = pgp(cn); // your database object

function getNextData(t, pageIndex) {
    let data = null;
    let data2 = null;
    if (pageIndex < 50000) {
        console.log('Page Index: ', pageIndex);
        data = [];
        data2 = [];
        let j = 0;
        for (let i = 0; i < 500000; i++) {
            let ipInfo = faker.internet.ip();
            let country = faker.address.country();
            data.push({
                ip: ipInfo,
                subscriptionstatus: faker.random.arrayElement(['Expired', 'Subscribed', 'None'])
            });
            data2.push({
                ip: ipInfo,
                region: country
            });
            console.log('Data Import Push: ', j);
            j++;
        }
    }
    //console.log('Table Record Length from getNextData: ', data.length);
    //console.log('Regions Record Length from getNextData: ', data2.length);
    return Promise.resolve([data, data2]);
}

db.tx('massive-insert', t => {
    return t.sequence(index => {
        return getNextData(t, index)
            .then(data => {                
                if (data) {
                    //console.log('Data 0:', data[0]);
                    //console.log('Data 1:', data[1]);
                    const insert = pgp.helpers.insert(data[0], cs);
                    const insert2 = pgp.helpers.insert(data[1], cs2);
                    
                    t.none(insert);
                    t.none(insert2);
                }
            });
    });
})
.then(data => {
    // COMMIT has been executed
    console.log('Total batches:', data.total, ', Duration:', data.duration);
})
.catch(error => {
    // ROLLBACK has been executed
    console.log(error);
});



