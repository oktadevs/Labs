const express = require("express"),
  mongoose = require("mongoose"),
  app = express();

app.get("/", function(req, res) {
  res.send("You've reached the root route!!!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("This server is ALIVE!!!!");
