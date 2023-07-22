import { assert } from 'chai';
import request from 'supertest'
import { config } from "dotenv";
import {app} from "~/index";
import {RestaurantDTO} from "~/types/restaurants";
config();

//npm run test
describe('Restaurants tests (TOKEN, GET, POST, PUT, DELETE)', () => {

    const admin = {
        'email': 'admin@admin',
        'password': 'admin'
    };

    let token: string;

    // TOKEN
    before((done) => {
        request(app)
            .post('/login')
            .send(admin)
            .end((err, res) => {
                if (err) return done(err);
                token = res.body.accessToken;
                done();
            });
    });

    // GET
    it('Ce test doit retourner une erreur 401 (Unauthorized), car je ne passe pas de token', (done) => {
        request(app)
            .get('/restaurants')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.error, 'Authorization required');
                done();
            });
    });

    it('Ce test doit retourner les données des restaurants', function (done) {
        request(app)
            .get('/restaurants')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end(function (err) {
                if (err) return done(err);
                done();
            });
    });

    // // ID pour tester les routes qui ont besoin d'un /:id
    let idRestaurantTest: string;

    // // POST
    it('Ce test doit créer un nouveau restaurant', (done) => {
        const restaurantData: RestaurantDTO = new RestaurantDTO({
            address: {},
            borough: "Paris",
            cuisine: "Français",
            grades: [],
            name: "Gusto",
            restaurant_id: ""
        });

        request(app)
            .post('/articles')
            .set('Authorization', `Bearer ${token}`)
            .send(restaurantData)
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);
                assert.exists(res.body.id);
                idRestaurantTest = res.body.restaurant_id;

                assert.equal(res.body.name, restaurantData.name);
                done();
            });
    });

    // PUT
    it("Ce test doit modifier avec PUT l'article qu'on a crée avant", function (done) {
        const restaurantData: RestaurantDTO = new RestaurantDTO({
            address: {building: "12", coord: ["151.12354", "-151.454"], street: "Avenue de Roubaix", zipcode: "73000"},
            borough: "Paris",
            cuisine: "Français",
            grades: [{date: '2014-06-10T00:00:00.000Z', grade: 'A', score: 8}],
            name: "Gusto",
            restaurant_id: ""
        });

        request(app)
            .put(`restaurants/${idRestaurantTest}`)
            .set('Authorization', `Bearer ${token}`)
            .send(restaurantData)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                const modifiedeRestaurant: RestaurantDTO = res.body;
                assert.equal(modifiedeRestaurant.name, restaurantData.name);
                assert.equal(modifiedeRestaurant.borough, restaurantData.borough);
                done();
            })
    })

    // DELETE
    it("Ce test doit supprimer l'article qu'on a crée avant", function (done) {
        request(app)
            .delete(`restaurants/${idRestaurantTest}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
            .end(function (err, res) {
                request(app)
                    .get(`restaurants/${idRestaurantTest}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(404)
                    .end(function (err, res) {
                        if (err) return done(err);
                        assert.equal(res.body.error, 'Restaurant not found');
                        done();
                    });
            })
    })
});