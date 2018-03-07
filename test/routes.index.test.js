process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../feat/index');
const knex = require('../feat/db/connection');

describe('routes : index', () => {

    beforeEach(() => {
      return knex.migrate.rollback()
      .then(() => { return knex.migrate.latest(); })
      .then(() => { return knex.seed.run(); });
    });
  
    afterEach(() => {
      return knex.migrate.rollback();
    });

    describe('GET /user/:userid', () => {
        it('should respond with a single user along with their region', (done) => {
          chai.request(server)
          .get('/user/1')
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.status.should.equal('postgres get success');
            res.body.data.length.should.eql(1);
            res.body.data[0].should.include.keys(
              'userid', 'region', 'subscriptionstatus'
            )
            res.body.data.should.eql([
                {
                  'userid': 1,
                  'subscriptionstatus': 'Expired',
                  'region': 'Canada'
                }
            ]);
            done();
          });
        });

        it('should throw an error if the user does not exist', (done) => {
            chai.request(server)
            .get('/user/9')
            .end((err, res) => {
              should.exist(err);
              res.status.should.equal(404);
              res.type.should.equal('application/json');
              res.body.status.should.eql('error');
              res.body.message.should.eql('That user does not exist.');
              done();
            });
          });

    }); // End of describe: GET /user/:userid

    describe('POST /login', () => {
      it('should update users table with new IP and subscription status', (done) => {
        chai.request(server)
        .post('/login')
        .send({
          userid: 3,
          ip: '123.200.15.7',
          subscriptionstatus: 'None'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('postgres update success (IP and Subscription Status)');
          res.body.data.should.equal(1);
          done();
        });
      });
    });

    describe('POST /login', () => {
      it('should return the new user data that was added', (done) => {
        chai.request(server)
        .post('/login')
        .send({
          ip: '123.200.14.8',
          subscriptionstatus: 'None'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(201);
          res.type.should.equal('application/json');
          res.body.status.should.eql('postgres insert success (User ID, IP, and Status)');
          res.body.data[0].should.include.keys(
            'userid', 'ip', 'subscriptionstatus'
          );
          done();
        });
      });
    });



    // describe('POST /login', () => {
    //   it('should return the user that was added', (done) => {
    //     chai.request(server)
    //     .post('/login')
    //     .send({
    //       ip: '123.200.14.8',
    //       subscriptionstatus: 'Subscribed'
    //     })
    //     .end((err, res) => {
    //       // there should be no errors
    //       should.not.exist(err);
    //       // there should be a 201 status code
    //       // (indicating that something was "created")
    //       res.status.should.equal(201);
    //       // the response should be JSON
    //       res.type.should.equal('application/json');
    //       // the JSON response body should have a
    //       // key-value pair of {"status": "success"}
    //       res.body.status.should.eql('success');
    //       // the JSON response body should have a
    //       // key-value pair of {"data": 1 movie object}
    //       res.body.data[0].should.include.keys(
    //         'userid', 'ip', 'subscriptionstatus'
    //       );
    //       done();
    //     });
    //   });
    // });
  
});