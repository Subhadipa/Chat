const express = require('express');
var bodyParser = require('body-parser');
const cors=require("cors")
const route = require('./src/Routes/routes');
const mongoose = require('mongoose')
require("dotenv").config();
const app = express();

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGOURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((error) => {
    console.log("Error connecting to database!");
    // console.log(error)
  });


app.use('/', route);

app.listen(process.env.PORT || 4000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 4000))
});