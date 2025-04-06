import request from 'supertest';
import { app } from '../src/app';
import { SETTINGS } from '../src/settings/settings';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { closeDB, runDB } from '../src/db/mongoDB';

describe('/blogs', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        await runDB(uri)
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('should create', async () => {
        const res = await request(app)
            .get(SETTINGS.COLLECTIONS.BLOGS)
            .expect(200)

        console.log(res.status);
        console.log(res.body);
        expect(res.body.items.length).toBe(0)
    })

    afterAll(async () => {
        await closeDB()
    })

})