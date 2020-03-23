const request = require('supertest');
const chai = require('chai');

const server = require('../../src/server/server');

const { expect } = chai;

describe('UserComponent -> controller', () => {
    let refreshToken = '';
    let userId = '';

    it('UserComponent -> controller -> /v2/users/create', (done) => {
        request(server)
            .post('/v2/users/create')
            .set('Accept', 'application/json')
            .send({ email: 'Nt1ef@gmail.com', password: 'Zodiac' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);
                expectBody.to.have.property('data').and.to.be.a('object');

                done();
            })
            .catch((err) => done(err));
    });
    it('UserComponent -> controller -> /v2/users/login', (done) => {
        request(server)
            .post('/v2/users/login')
            .set('Accept', 'application/json')
            .send({ email: 'Nt1ef@gmail.com', password: 'Zodiac' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);
                refreshToken = body.tokens.RefreshToken;
                userId = body.data._id;
                expectBody.to.have.property('data').and.to.be.a('object');

                done();
            })
            .catch((err) => done(err));
    });
    it('UserComponent -> controller -> /v2/users/', (done) => {
        request(server)
            .get('/v2/users/')
            .set('refreshtoken', refreshToken, 'Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);
                expectBody.to.have.property('data').and.to.be.a('array');

                done();
            })
            .catch((err) => done(err));
    });
    it('UserComponent -> controller -> /v2/users/:id', (done) => {
        request(server)
            .get(`/v2/users/${userId}`)
            .set('refreshtoken', refreshToken, 'Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);
                expectBody.to.have.property('data').and.to.be.a('object');

                done();
            })
            .catch((err) => done(err));
    });
    it('UserComponent -> controller -> /v2/users/update', (done) => {
        request(server)
            .put('/v2/users/update')
            .set('refreshtoken', refreshToken, 'Accept', 'application/json')
            .send({ id: userId, email: 'Ntef@gmail.com' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);
                expectBody.to.have.property('data').and.to.be.a('object');

                done();
            })
            .catch((err) => done(err));
    });
    it('UserComponent -> controller -> /v2/users/logout', (done) => {
        request(server)
            .post('/v2/users/logout')
            .set('refreshtoken', refreshToken, 'Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);
                expectBody.to.be.a('object');

                done();
            })
            .catch((err) => done(err));
    });
    it('UserComponent -> controller -> /v2/users/delete', (done) => {
        request(server)
            .del('/v2/users/delete')
            .set('refreshtoken', refreshToken, 'Accept', 'application/json')
            .send({ id: userId })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);
                expectBody.to.have.property('data');

                done();
            })
            .catch((err) => done(err));
    });
});
