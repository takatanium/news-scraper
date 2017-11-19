const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const app = express();

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/news-scraper", {
  useMongoClient: true
});

const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

require("./controllers/controller.js")(app);

app.listen(PORT, () => console.log("App running on port " + PORT + "!") );
