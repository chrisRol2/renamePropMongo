import { MongoClient } from "mongodb";
import * as readline from "readline";
import { RenameFieldInLatestDocumentOptions } from "./types";

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

/**
 * interactive renames a field in the latest document of a collection.
 * @param {RenameFieldInLatestDocumentOptions} options - Options for renaming a field in the latest document.
 * @returns {Promise<void>}
 * @example
 * renameFieldInLatestDocument({
 *  MONGODB_URI: "mongodb://localhost:27017",
 * DB_NAME: "dbName",
 * COLLECTION_NAME: "collectionName",
 * DATE_FIELD: "createdAt",
 * OLD_FIELD: "oldField",
 * NEW_FIELD: "newField",
 * VALIDATION_FIELD: "_id",
 * });
 * @example
 */
const renameFieldInLatestDocument = async ({
  MONGODB_URI,
  DB_NAME,
  COLLECTION_NAME,
  DATE_FIELD,
  OLD_FIELD,
  NEW_FIELD,
  VALIDATION_FIELD,
  options = {
    noInteractive: false,
    verbose: true,
  },
}: RenameFieldInLatestDocumentOptions): Promise<void> => {
  const uri = MONGODB_URI;
  const dbName = DB_NAME;
  const collectionName = COLLECTION_NAME;
  const dateField = DATE_FIELD;
  const oldField = OLD_FIELD;
  const newField = NEW_FIELD;
  const validationField = VALIDATION_FIELD;

  const client = new MongoClient(uri);
  let log = console.log;
  if (!options?.verbose) {
    log = (_message?: any, ..._optionalParams: any[]) => {};
  }

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
      log(
        `Document found with the ${validationField}: ${
          document[`${validationField}`]
        }`
      );

      let answer = "yes";
      if (!options?.noInteractive) {
        process.stdout.write("Is the document correct? (yes/no): ");
        answer = await askQuestion("Is the document correct? (yes/no): ");
      }
      if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
        await collection.updateOne(
          { _id: document._id },
          { $rename: { [oldField]: newField } }
        );

        log("Field renamed successfully.");
      } else {
        log("The document is not correct.");
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

export { renameFieldInLatestDocument };
