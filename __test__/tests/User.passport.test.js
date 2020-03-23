const request = require('supertest');
const chai = require('chai');

const server = require('../../src/server/server');

const { expect } = chai;

describe('UserComponent -> controller', () => {
    let refreshToken = '';
    let userId = '';

    it('UserComponent -> controller -> /v1/users/create', (done) => {
        request(server)
            .post('/v1/users/register')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({ email: 'Nnn@gmail.com', fullName: 'ddd', password: 'Zodiac' })
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);
                expectBody.to.have.property('data').and.to.be.a('object');

                done();
            })
            .catch((err) => done(err));
    });
});
