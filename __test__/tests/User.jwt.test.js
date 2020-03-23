const request = require('supertest');
const chai = require('chai');

const server = require('../../src/server/server');

const { expect } = chai;

describe('UserComponent -> controller', () => {
    let refreshToken = '';
    let userId = '';

    describe('UserComponent -> controller -> /v2/users/create', () => {
        it('Create new user with [200]', (done) => {
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
        it('!Create user with bad params [422]', (done) => {
            request(server)
                .post('/v2/users/create')
                .set('Accept', 'application/json')
                .send({ email: '', password: '' })
                .expect('Content-Type', /json/)
                .expect(422)
                .then(({ body }) => {
                    const expectBody = expect(body);
                    expectBody.to.be.a('object').and.to.have.property('message', 'E_MISSING_OR_INVALID_PARAMS');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('UserComponent -> controller -> /v2/users/login', () => {
        it('Login user [200]', (done) => {
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
        it('Login user with wrong params [200]', (done) => {
            request(server)
                .post('/v2/users/login')
                .set('Accept', 'application/json')
                .send({ email: 'Nt1ef@gmail.com', password: '111' })
                .expect('Content-Type', /json/)
                .expect(200)
                .then(({ body }) => {
                    const expectBody = expect(body);
                    expectBody.to.be.a('object').and.to.have.property('status', 'notlogin');

                    done();
                })
                .catch((err) => done(err));
        });
        it('Login user without any params [422]', (done) => {
            request(server)
                .post('/v2/users/login')
                .set('Accept', 'application/json')
                .send({ email: '', password: '' })
                .expect('Content-Type', /json/)
                .expect(422)
                .then(({ body }) => {
                    const expectBody = expect(body);
                    expectBody.to.be.a('object').and.to.have.property('error', 'E_MISSING_OR_INVALID_PARAMS');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('UserComponent -> controller -> /v2/users/', () => {
        it('Get user with token [200]', (done) => {
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
        it('!Get user with bad token [406]', (done) => {
            request(server)
                .get('/v2/users/')
                .set('refreshtoken', '', 'Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(406)
                .then(({ body }) => {
                    const expectBody = expect(body);
                    expectBody.to.have.property('error').and.to.be.a('object');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('UserComponent -> controller -> /v2/users/:id', () => {
        it('Find user with [200]', (done) => {
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
        it('!Find user with bad param [200]', (done) => {
            request(server)
                .get('/v2/users/5e78f48586e4560a10d6d7ea')
                .set('refreshtoken', refreshToken, 'Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(({ body }) => {
                    const expectBody = expect(body);
                    expectBody.to.have.property('data').and.to.be.a('null');

                    done();
                })
                .catch((err) => done(err));
        });
        it('!Find user without token [406]', (done) => {
            request(server)
                .get('/v2/users/5e78f48586e4560a10d6d7ea')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(406)
                .then(({ body }) => {
                    const expectBody = expect(body);
                    expectBody.to.have.property('error').and.to.be.a('object');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('UserComponent -> controller -> /v2/users/update', () => {
        it('Update user [200]', (done) => {
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
        it('!Update user with bad params [422]', (done) => {
            request(server)
                .put('/v2/users/update')
                .set('refreshtoken', refreshToken, 'Accept', 'application/json')
                .send({ id: '', email: '' })
                .expect('Content-Type', /json/)
                .expect(422)
                .then(({ body }) => {
                    const expectBody = expect(body);
                    expectBody.to.be.a('object').and.to.have.property('message', 'E_MISSING_OR_INVALID_PARAMS');

                    done();
                })
                .catch((err) => done(err));
        });
        it('!Update user without token [406]', (done) => {
            request(server)
                .put('/v2/users/update')
                .set('refreshtoken', '', 'Accept', 'application/json')
                .send({ id: userId, email: 'Ntef@gmail.com' })
                .expect('Content-Type', /json/)
                .expect(406)
                .then(({ body }) => {
                    const expectBody = expect(body);
                    expectBody.to.have.property('error').and.to.be.a('object');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('UserComponent -> controller -> /v2/users/logout', () => {
        it('User logout [200]', (done) => {
            request(server)
                .get('/v2/users/logout')
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
        it('User logout without token [406]', (done) => {
            request(server)
                .get('/v2/users/logout')
                .set('refreshtoken', '', 'Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(406)
                .then(({ body }) => {
                    const expectBody = expect(body);
                    expectBody.to.have.property('error').and.to.be.a('object');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('UserComponent -> controller -> /v2/users/delete', () => {
        it('User delete [200]', (done) => {
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
        it('User delete with bad param [422]', (done) => {
            request(server)
                .del('/v2/users/delete')
                .set('refreshtoken', refreshToken, 'Accept', 'application/json')
                .send({ id: '' })
                .expect('Content-Type', /json/)
                .expect(422)
                .then(({ body }) => {
                    const expectBody = expect(body);
                    expectBody.to.be.a('object').and.to.have.property('message', 'E_MISSING_OR_INVALID_PARAMS');

                    done();
                })
                .catch((err) => done(err));
        });
        it('User delete without token [406]', (done) => {
            request(server)
                .del('/v2/users/delete')
                .set('refreshtoken', '', 'Accept', 'application/json')
                .send({ id: userId })
                .expect('Content-Type', /json/)
                .expect(406)
                .then(({ body }) => {
                    const expectBody = expect(body);
                    expectBody.to.have.property('error').and.to.be.a('object');

                    done();
                })
                .catch((err) => done(err));
        });
    });
});
