#!/usr/bin/env node
import * as dotenv from "dotenv";

import { hideBin } from "yargs/helpers";
import yargs from "yargs";
import { renameFieldInLatestDocument } from "./lib";

dotenv.config();

(async () => {
  const argv = await yargs(hideBin(process.argv))
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

  const uri =
    argv.MONGODB_URI || process.env.MONGODB_URI || "mongodb://localhost:27017";
  const dbName = argv.DB_NAME || process.env.DB_NAME || "dbName";
  const collectionName =
    argv.COLLECTION_NAME || process.env.COLLECTION_NAME || "collectionName";
  const dateField = argv.DATE_FIELD || process.env.DATE_FIELD || "cratedAt";
  const oldField = argv.OLD_FIELD || process.env.OLD_FIELD || "oldField";
  const newField = argv.NEW_FIELD || process.env.NEW_FIELD || "newField";
  const validationField =
    argv.VALIDATION_FIELD || process.env.VALIDATION_FIELD || "_id";

  renameFieldInLatestDocument({
    MONGODB_URI: uri,
    DB_NAME: dbName,
    COLLECTION_NAME: collectionName,
    DATE_FIELD: dateField,
    OLD_FIELD: oldField,
    NEW_FIELD: newField,
    VALIDATION_FIELD: validationField,
  });
})();

export { renameFieldInLatestDocument };
export default renameFieldInLatestDocument;