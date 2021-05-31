const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImage: {
    type: Buffer, //buffer of the data representing our entire image
    required: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

//this will allow us to create a virtual property, it will act as a variable that we have above on book but it will derive its value from these above  variable
//
bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage !== null && this.coverImageType !== null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`; //this is going to return to us proper string for our image source in order to display image frombuffer and type
  }
});

module.exports = mongoose.model("Book", bookSchema);
