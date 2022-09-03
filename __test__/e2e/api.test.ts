import request from 'supertest';
import {app, HTTP_STATUSES, Users} from '../../src';
import {STATUS_CODES} from 'http';
import {UserCreateModel} from 'Models/create.model';

describe('/test api', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data');
    });

    it('should return 200 and empty array', async () => {
        await request(app).get('/users').expect(HTTP_STATUSES.OK_200, []);
    });

    it('should return 404 for not existing user', async () => {
        await request(app).get('/users/Valibek').expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it('should not create user with incorrect input data', async () => {
        await request(app).post('/user').send({name: ''}).expect(HTTP_STATUSES.BAD_REQUEST_400);
        await request(app).get('/users').expect(HTTP_STATUSES.OK_200, []);
    });

    let _createdUser: Users = {id: 0, name: ''};
    it('should create user with correct input data', async () => {
        const data: UserCreateModel = {name: 'Alex'}
        const createResponse = await request(app).post('/user').send(data).expect(HTTP_STATUSES.CREATED_201);
        _createdUser = createResponse.body;

        expect(_createdUser).toEqual({
            id: expect.any(Number),
            name: 'Alex'
        });
        await request(app).get('/users').expect(HTTP_STATUSES.OK_200, [_createdUser]);
    });

    it('shouldn\'t not update user with incorrect input data', async () => {
        await request(app).put(`/user/212`).send({name: ''}).expect(HTTP_STATUSES.BAD_REQUEST_400);
        await request(app).get(`/user/${_createdUser.id}`).expect(HTTP_STATUSES.OK_200, [_createdUser]);
    });

    it('should update user with correct input data', async () => {
        const createResponse = await request(app).put(`/user/${_createdUser.id}`).send({name: 'Alexey'}).expect(HTTP_STATUSES.CREATED_201);
        const changedUser = createResponse.body;

        expect(changedUser).toEqual({
            id: expect.any(Number),
            name: 'Alexey'
        });
        await request(app).get('/users').expect(HTTP_STATUSES.OK_200, [changedUser]);
    });

    it('shouldn\'t not update user that not exist', async () => {
        await request(app).put(`/user/212`).send({name: 'Giyas'}).expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it('should update user with correct input data and get with user', async () => {
        const createResponse = await request(app).put(`/user/${_createdUser.id}`).send({name: 'Johnson'}).expect(HTTP_STATUSES.CREATED_201);
        const changedUser = createResponse.body;

        expect(changedUser).toEqual({
            id: expect.any(Number),
            name: 'Johnson'
        });
        await request(app).get(`/user/${_createdUser.id}`).expect(HTTP_STATUSES.OK_200, [changedUser]);
    });

    it('should delete user with correct input data', async () => {
        await request(app).delete(`/user/${_createdUser.id}`).expect(HTTP_STATUSES.NO_CONTENT_204);
        await request(app).get(`/users`).expect(HTTP_STATUSES.OK_200, []);
    });
});