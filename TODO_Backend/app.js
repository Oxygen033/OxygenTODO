const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./src/config/db.config');
const cors = require('cors');

const usersRoutes = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();

const PORT = process.env.PORT || 3010;

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
    res.setHeader("Access-Control-Expose-Headers", "Authorization");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
dotenv.config();

usersRoutes(app);
taskRoutes(app);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

module.exports = app;