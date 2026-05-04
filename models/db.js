const Datastore = require('nedb-promises');
const path = require('path');

const db = {
  users: Datastore.create({  filename: path.join(dirname, '../data/users.db'), autoload: true }),
  todos: Datastore.create({ filename: path.join(dirname, '../data/todos.db'), autoload: true }),
  collections: Datastore.create({ filename: path.join(dirname, '../data/collections.db'), autoload: true }),
  ratings: Datastore.create({ filename: path.join(dirname, '../data/ratings.db'), autoload: true }),
};

// Indexes
db.users.ensureIndex({ fieldName: 'email', unique: true });
db.todos.ensureIndex({ fieldName: 'userId' });

module.exports = db;