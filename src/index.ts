import { app } from "./app";
import { runDB } from "./db/mongoDB";
import { SETTINGS } from "./settings/settings";


const startApp = async () => {
  const res = await runDB(SETTINGS.DB_PATH);
  if (!res) process.exit(1);

  app.set('trust proxy', true)

  app.listen(SETTINGS.PORT, () => {
    console.log("...server started in port " + SETTINGS.PORT);
  });
};

startApp();
