import request from 'supertest';
import { app } from '../src/app';
import { SETTINGS } from '../src/settings/settings';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

describe('/blogs', () => {

    let mongoServer: MongoMemoryServer;
    let client: MongoClient;

    let blogsCollection: any;
    let postsCollection: any;


    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        client = new MongoClient(uri)

        const db = client.db('blogs')
        // blogsCollection = db.collection(SETTINGS.COLLECTIONS.BLOGS)
        // postsCollection = db.collection(SETTINGS.COLLECTIONS.POSTS)

        // // Очищаем коллекции перед тестами
        // await blogsCollection.deleteMany({});
        // await postsCollection.deleteMany({});
    })

    it('should create', async () => {
        const res = await request(app)
            .get(SETTINGS.COLLECTIONS.BLOGS)
            .expect(200)

        console.log(res.status);
        console.log(res.body);
        expect(res.body.length).toBe(0)
    })

    afterAll(async () => {
        await mongoServer.stop()
    })

})