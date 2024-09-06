To make the application work properly, you need to add the following environment variables to your `.zshrc` or `.bashrc` file:

```shell
export MONGODB_URI=mongodb://localhost:27017
export DB_NAME=db
export COLLECTION_NAME=myCollection
export DATE_FIELD=cratedAt
export OLD_FIELD=old
export NEW_FIELD=new
```

Make sure to replace `localhost:27017` with the appropriate MongoDB URI if your database is hosted elsewhere.
