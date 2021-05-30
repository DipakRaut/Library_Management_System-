// handle data logic
// interacts with database
// mongoose is a library which is used to connect to the mongodb
// schema is same thing as table in normal sequel database

const mongoose = require("mongoose");

const authorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// const mySchema = mongoose.Schema({
//   name: {
//     type: Number,
//     required: true,
//   },
// });

module.exports = mongoose.model("Author", authorSchema); //Author is the name of the Table inside our database
// module.exports = mongoose.model("myTable", mySchema); //Author is the name of the Table inside our database
