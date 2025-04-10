import { MongoClient } from "mongodb";
import { SETTINGS } from "../settings/settings";

export let blogsCollection: any;
export let postsCollection: any;
export let commentsCollection: any;
export let usersCollection: any;
export let refreshTokensCollection: any;

export let mongoClient: MongoClient;

// проверка подключения к бд
export const runDB = async (url: string): Promise<boolean> => {
  mongoClient = new MongoClient(url);
  const db = mongoClient.db(SETTINGS.DB_NAME);

  // получение доступа к коллекциям
  blogsCollection = db.collection(SETTINGS.COLLECTIONS.BLOGS)
  postsCollection = db.collection(SETTINGS.COLLECTIONS.POSTS)
  commentsCollection = db.collection(SETTINGS.COLLECTIONS.COMMENTS)
  usersCollection = db.collection(SETTINGS.COLLECTIONS.USERS)
  refreshTokensCollection = db.collection(SETTINGS.COLLECTIONS.REFRESH_TOKEN)

  try {
    await mongoClient.connect();
    console.log("connected to db");
    return true;
  } catch (e) {
    console.log(e);
    await mongoClient.close();
    return false;
  }
};

export async function closeDB() {  
  try {
      await mongoClient.close();
      console.log('MongoDB connection closed');
  } catch (err) {
      console.error('Failed to close MongoDB connection', err);
  }
}
