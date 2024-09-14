interface RenameFieldInLatestDocumentOptions {
  MONGODB_URI: string;
  DB_NAME: string;
  COLLECTION_NAME: string;
  DATE_FIELD: string;
  OLD_FIELD: string;
  NEW_FIELD: string;
  VALIDATION_FIELD: string;
  options?: {
    force?: boolean;
    noInteractive?: boolean;
    verbose?: boolean;
  };
}

export { RenameFieldInLatestDocumentOptions };
