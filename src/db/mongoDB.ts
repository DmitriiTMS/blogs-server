import { MongoClient } from "mongodb";
import { SETTINGS } from "../settings/settings";

export let blogsCollection: any;
export let postsCollection: any;

// проверка подключения к бд
export const runDB = async (url: string): Promise<boolean> => {
  const client: MongoClient = new MongoClient(url);
  const db = client.db(SETTINGS.DB_NAME);

  // получение доступа к коллекциям
  blogsCollection = db.collection(SETTINGS.PATH.BLOGS)
  postsCollection = db.collection(SETTINGS.PATH.POSTS)

  try {
    await client.connect();
    console.log("connected to db");
    return true;
  } catch (e) {
    console.log(e);
    await client.close();
    return false;
  }
};
