import { assert } from 'chai';
import request from 'supertest'
import { app } from '~~/src';
import { config } from "dotenv";
config();

//npm run test
describe('Restaurants tests (TOKEN, GET, POST, PUT, DELETE)', () => {

    let token: string;

    // TOKEN
    before((done) => {
        request(app)
            .post('/users')
            .send({

            })
            .end(function (err, res) {
                if (err) return done(err);
                token = res.body.accessToken;
                done();
            });

        request(app)
            .post('/login')
            .send(admin)
            .end(function (err, res) {
                if (err) return done(err);
                token = res.body.accessToken;
                done();
            });
    });
});