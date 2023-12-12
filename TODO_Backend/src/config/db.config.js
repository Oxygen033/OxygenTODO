const mongoose = require('mongoose');

let db;
mongoose.connect('mongodb://localhost:27017/todo-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
db = mongoose.connection;
db.on("error", console.error.bind(console, "DB connection error: "));

module.exports = db;