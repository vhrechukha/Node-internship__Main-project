const chai = require('chai');

const UtilService = require('../../src/components/User2/service');

const { expect } = chai;

describe('UserComponent -> service', () => {
    let userId = '';
    it('UserComponent -> service -> findAll', (done) => {
        UtilService.findAll()
            .then((body) => {
                const expectBody = expect(body);
                expectBody.to.be.an('array');
                done();
            })
            .catch(done);
    });
    it('UserComponent -> service -> create', (done) => {
        UtilService.create({ email: 'New User@gmail.com', fullName: 'ASTORIA', password: 'somepassword' })
            .then((body) => {
                // eslint-disable-next-line no-underscore-dangle
                userId = body._id;
                const expectBody = expect(body);
                expectBody.to.be.an('object');
                done();
            })
            .catch(done);
    });
    it('UserComponent -> service -> findByEmail', (done) => {
        UtilService.findByEmail('New User@gmail.com')
            .then((body) => {
                const expectBody = expect(body);
                expectBody.to.be.an('object');
                done();
            })
            .catch(done);
    });
    it('UserComponent -> service -> findById', (done) => {
        UtilService.findById(userId)
            .then((body) => {
                const expectBody = expect(body);
                expectBody.to.be.an('object');
                done();
            })
            .catch(done);
    });
    it('UserComponent -> service -> updateById', (done) => {
        UtilService.updateById({ id: userId, newProfile: 'NewFullName' })
            .then((body) => {
                const expectBody = expect(body);
                expectBody.to.be.an('object');
                done();
            })
            .catch(done);
    });
    it('UserComponent -> service -> delete', (done) => {
        UtilService.deleteById({ _id: userId })
            .then((body) => {
                const expectBody = expect(body);
                expectBody.to.be.an('object');
                done();
            })
            .catch(done);
    });
});
