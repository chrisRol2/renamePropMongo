# Rename Prop Mongo
## Usage
This command searches for the most recently created document using the `DATE_FIELD` as the parameter to identify the newest document. It then renames the field specified by `OLD_FIELD` to the new name provided in `NEW_FIELD`.

The `VALIDATION_FIELD` is used to validate the document before renaming the field. If the document does not contain the `VALIDATION_FIELD`, the command will not rename the field. 


To make the application work properly, you need to add the following environment variables to your `.zshrc` or `.bashrc` file:


```ts
import { renameFieldInLatestDocument } from "rename-prop-mongo";

await renameFieldInLatestDocument({
    MONGODB_URI: "mongodb://localhost:27017",
    DB_NAME: "test",
    COLLECTION_NAME: "test",
    DATE_FIELD: "date",
    OLD_FIELD: "old",
    NEW_FIELD: "new",
    VALIDATION_FIELD: "validation",
  });
```


```shell
export MONGODB_URI=mongodb://localhost:27017
export DB_NAME=db
export COLLECTION_NAME=myCollection
export DATE_FIELD=cratedAt
export OLD_FIELD=old
export NEW_FIELD=new
export VALIDATION_FIELD=_id
```
commandLine
```shell
  npx rename-prop-mongo@latest \
      -m "mongodb://localhost:27017" \
      -d "myDatabase" \
      -c "myCollection" \
      -f "createdAt" \
      -o "oldField" \
      -n "newField" \
      -v "_id"
```
 
 ```
  MONGODB_URI: The URI of your MongoDB database.
  DB_NAME: The name of the database you want to use.
  COLLECTION_NAME: The name of the collection you want to use.
  DATE_FIELD: The name of the field that contains the date when the document was created.
  OLD_FIELD: The name of the field you want to rename.
  NEW_FIELD: The new name you want to give to the field.
  VALIDATION_FIELD: The name of the field you want to use to validate the documents.

 ```
 usage:
 


Make sure to replace `localhost:27017` with the appropriate MongoDB URI if your database is hosted elsewhere.


