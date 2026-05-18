const Datastore = require("nedb-promises");
const path = require("path");

const db = {
  users: Datastore.create({
    filename: path.join(__dirname, "../data/users.db"),
    autoload: true,
  }),
  todos: Datastore.create({
    filename: path.join(__dirname, "../data/todos.db"),
    autoload: true,
  }),
  collections: Datastore.create({
    filename: path.join(__dirname, "../data/collections.db"),
    autoload: true,
  }),
  feedbacks: Datastore.create({
    filename: path.join(__dirname, "../data/feedbacks.db"),
    autoload: true,
  }),
};

// Indexes
db.users.ensureIndex({ fieldName: "email", unique: true });
db.todos.ensureIndex({ fieldName: "userId" });
db.feedbacks.ensureIndex({ fieldName: "userId" });
module.exports = db;


  