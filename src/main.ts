#!/usr/bin/env node
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import * as readline from "readline";
dotenv.config();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Is the document correct? (yes/no): ",
});

const renameFieldInLatestDocument = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const dbName = process.env.DB_NAME;
  const collectionName = process.env.COLLECTION_NAME || "dbName";
  const dateField = process.env.DATE_FIELD || "cratedAt";
  const oldField = process.env.OLD_FIELD || "oldField";
  const newField = process.env.NEW_FIELD || "newField";
  const validationField = process.env.VALIDATION_FIELD || "_id";

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const recentDocument = await collection
      .find()
      .sort({
        [dateField]: -1,
      })
      .limit(1)
      .toArray();

    if (recentDocument.length > 0) {
      const document = recentDocument[0];
      console.log(
        `Document found with the ${validationField}: ${
          document[`${validationField}`]
        }`
      );

      let myanswer = false;
      process.stdout.write("Is the document correct? (yes/no): ");
      rl.on("line", (answer) => {
        if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
          console.log("The document is correct.");
          myanswer = true;
        } else {
          console.log("The document is not correct.");
          myanswer = true;
        }
        rl.close();
      });
      if (myanswer) {
        await collection.updateOne(
          { _id: document._id },
          { $rename: { [oldField]: newField } }
        );

        console.log("Field renamed successfully.");
      }
    } else {
      console.log("No document found.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
};

(async () => {
  renameFieldInLatestDocument();
})();

export { renameFieldInLatestDocument };
export default renameFieldInLatestDocument;