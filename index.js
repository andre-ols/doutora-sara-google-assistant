const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());

const bot = require('./src');

// Rota do bot
app.post('/bot', bot);

// listen for requests :)
app.listen(4444, () => {
  console.log("Your app is listening on port " + 4444);
});
