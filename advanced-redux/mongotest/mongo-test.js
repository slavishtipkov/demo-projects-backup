const mongo = require("mongodb");
const url = "mongodb://localhost:27017";

mongo.connect(url, { useNewUrlParser: true }, (err, db) => {
  if (err) {
    console.log(err);
    proccess.exit(0);
  }

  console.log("database connected!");
  db.close();
});
