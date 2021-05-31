// handle data logic
// interacts with database
// mongoose is a library which is used to connect to the mongodb
// schema is same thing as table in normal sequel database

const mongoose = require("mongoose");
const Book = require("./Book");
const authorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// this function will run before removing any object
authorSchema.pre("remove", function (next) {
  Book.find({ author: this.id }, (err, books) => {
    // this means we have books for this author if anything is returned
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error("This author has Books Still"));
    } else {
      next(); // means continue and remove the author
    }
  });
});

module.exports = mongoose.model("Author", authorSchema); //Author is the name of the Table inside our database
