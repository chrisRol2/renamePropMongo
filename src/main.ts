#!/usr/bin/env node
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import * as readline from "readline";
import { hideBin } from "yargs/helpers";
import yargs from "yargs";

dotenv.config();
const argv = yargs(hideBin(process.argv))
  .option("MONGODB_URI", {
    alias: "m",
    type: "string",
    description: "MongoDB connection URI",
  })
  .option("DB_NAME", {
    alias: "d",
    type: "string",
    description: "Database name",
  })
  .option("COLLECTION_NAME", {
    alias: "c",
    type: "string",
    description: "Collection name",
  })
  .option("DATE_FIELD", {
    alias: "f",
    type: "string",
    description: "Field used to sort documents by date",
  })
  .option("OLD_FIELD", {
    alias: "o",
    type: "string",
    description: "Field to be renamed",
  })
  .option("NEW_FIELD", {
    alias: "n",
    type: "string",
    description: "New name for the field",
  })
  .option("VALIDATION_FIELD", {
    alias: "v",
    type: "string",
    description: "Field used for validation",
  }).argv;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Is the document correct? (yes/no): ",
});

const askQuestion = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
};

const renameFieldInLatestDocument = async (): Promise<void> => {
  const uri =
    argv.MONGODB_URI || process.env.MONGODB_URI || "mongodb://localhost:27017";
  const dbName = argv.DB_NAME || process.env.DB_NAME;
  const collectionName =
    argv.COLLECTION_NAME || process.env.COLLECTION_NAME || "dbName";
  const dateField = argv.DATE_FIELD || process.env.DATE_FIELD || "cratedAt";
  const oldField = argv.OLD_FIELD || process.env.OLD_FIELD || "oldField";
  const newField = argv.NEW_FIELD || process.env.NEW_FIELD || "newField";
  const validationField =
    argv.VALIDATION_FIELD || process.env.VALIDATION_FIELD || "_id";

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

      process.stdout.write("Is the document correct? (yes/no): ");
      const answer = await askQuestion("Is the document correct? (yes/no): ");

      if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
        await collection.updateOne(
          { _id: document._id },
          { $rename: { [oldField]: newField } }
        );

        console.log("Field renamed successfully.");
      } else {
        console.log("The document is not correct.");
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