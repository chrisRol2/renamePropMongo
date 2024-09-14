import { MongoClient } from "mongodb";
import * as readline from "readline";

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

interface RenameFieldInLatestDocumentOptions {
  MONGODB_URI: string;
  DB_NAME: string;
  COLLECTION_NAME: string;
  DATE_FIELD: string;
  OLD_FIELD: string;
  NEW_FIELD: string;
  VALIDATION_FIELD: string;
}
const renameFieldInLatestDocument = async ({
  MONGODB_URI,
  DB_NAME,
  COLLECTION_NAME,
  DATE_FIELD,
  OLD_FIELD,
  NEW_FIELD,
  VALIDATION_FIELD,
}: RenameFieldInLatestDocumentOptions): Promise<void> => {
  const uri = MONGODB_URI;
  const dbName = DB_NAME;
  const collectionName = COLLECTION_NAME;
  const dateField = DATE_FIELD;
  const oldField = OLD_FIELD;
  const newField = NEW_FIELD;
  const validationField = VALIDATION_FIELD;

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

export { renameFieldInLatestDocument };
