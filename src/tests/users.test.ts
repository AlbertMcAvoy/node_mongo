import { assert } from 'chai';
import request from 'supertest'
import { config } from "dotenv";
import {app} from "~/index";
import mongoose from "mongoose";
import * as http from "http";
import {UserDTO} from "~/types/users";
config();

//npm run test
describe('Users tests (TOKEN, GET, POST, PUT, DELETE)', () => {

    let server : http.Server;

    const admin = {
        'email': 'admin@admin',
        'password': 'admin'
    };

    let token: string;

    // TOKEN
    before(async () => {
        await mongoose.connect(process.env.MONGO_DB_URL || 'mongodb+srv://mykechastang:fYCZmUHTzOlXULNm@clusteralbert.c3xo0el.mongodb.net/sample_restaurants?retryWrites=true&w=majority')
            .then(() => {
                console.log('Connected!')

                /**
                 * Tell express to listen to request on the config port
                 */
                server = app.listen(process.env.API_PORT, () => console.log(`Application running on port : ${process.env.API_PORT}`))
            });

        return new Promise((resolve) =>  {
            request(server)
                .post('/login')
                .send(admin)
                .end(function(err, res) {
                    if (err) return resolve(err);
                    token = res.body.accessToken;
                    resolve();
                });
        })
    });

    // GET
    it('Ce test doit retourner une erreur 401 (Unauthorized), car je ne passe pas de token', function(done)  {
        request(server)
            .get('/users')
            .expect(401)
            .end(function(err, res)  {
                if (err) return done(err);
                assert.equal(res.body.error, 'Authorization required');
                done();
            });
    });

    it('Ce test doit retourner les données des users', function (done) {
        request(server)
            .get('/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });

    // // ID pour tester les routes qui ont besoin d'un /:id
    let idUserTest: string;

    // // POST
    it('Ce test doit créer un nouvel utilisateur', function(done)  {
        const userData: UserDTO = new UserDTO({
            uuid: "",
            name: "Marco",
            email: "marco@gmail.com",
            password: "marco"
        });

        request(server)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(userData)
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);
                assert.exists(res.body.uuid);
                idUserTest = res.body.uuid;

                assert.equal(res.body.name, userData.name);
                done();
            });
    });

    // PUT
    it("Ce test doit modifier avec PUT le utilisateur qu'on a créé avant", function (done) {
        const userData: UserDTO = new UserDTO({
            uuid: "",
            name: "Jean",
            email: "jean@orange.fr",
        });

        request(server)
            .put(`/users/${idUserTest}`)
            .set('Authorization', `Bearer ${token}`)
            .send(userData)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                const modifiedeUser: UserDTO = res.body;
                assert.equal(modifiedeUser.name, userData.name);
                assert.equal(modifiedeUser.email, userData.email);
                done();
            })
    })

    // DELETE
    it("Ce test doit supprimer le utilisateur qu'on a créé avant", function (done) {
        request(server)
            .delete(`/users/${idUserTest}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
            .end(() => {
                request(app)
                    .get(`/users/${idUserTest}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(404)
                    .end(function(err, res)  {
                        if (err) return done(err);
                        assert.equal(res.body.error, 'User not found');
                        done();
                    });
            })
    })

    after("Arrêt du serveur et cloture de la connexion avec Mongoose", async function () {
        await mongoose.disconnect();

        return new Promise((resolve) =>  {
            server.close();
            resolve();
        });
    })
});