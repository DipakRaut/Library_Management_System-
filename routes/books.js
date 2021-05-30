const express = require("express");
const author = require("../models/author");
const router = express.Router();
const Book = require("../models/Book");
const path = require("path");
const fs = require("fs");
const Author = require("../models/author");
const multer = require("multer");
const uploadPath = path.join("public", Book.coverImageBasePath);
const imageMimeType = ["image/jpeg", "image/png", "image/gif"];

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeType.includes(file.mimetype));
  },
});

// All Books Route
router.get("/", async (req, res) => {
  let query = Book.find(); // this return to us query objectswhich we can build a query from and execute later and we wanna build this query from our request query

  if (req.query.title != null && req.query.title !== "") {
    query = query.regex("title", new RegExp(req.query.title), "i"); // the title is the title from model parameter which we have defined in our database.
  }

  if (req.query.publishedBefore != null && req.query.publishedBefore !== "") {
    query = query.lte("publishDate", req.query.publishedBefore);
  }

  if (req.query.publishedAfter != null && req.query.publishedAfter !== "") {
    query = query.gte("publishDate", req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render("books/index", {
      books: books,
      searchOptions: req.query,
    });
  } catch (error) {
    res.redirect("/");
  }
});

// New Book Route just for displaying the form
router.get("/new", async (req, res) => {
  try {
    const allAuthors = await Author.find({}); // getting all authors books
    const book = new Book();

    res.render("books/new", {
      book: book,
      authors: allAuthors,
    });
  } catch (error) {
    res.redirect("/books");
  }
});

// Create Book Route
router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file !== null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.desp,
  });
  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    console.log("came upto here");
    res.redirect("books");
  } catch (error) {
    if (book.coverImageName !== null) {
      removeBookCoverImage(book.coverImageName);
    }
    renderNewPage(res, book, true);
  }
});

function removeBookCoverImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.log(err);
  });
}
async function renderNewPage(res, book, hasError = false) {
  try {
    const allAuthors = await Author.find({}); // getting all authors books
    const params = {
      book: book,
      authors: allAuthors,
    };
    if (hasError) params.errorMessage = "Error creating Books";
    res.render("books/new", params);
  } catch (error) {
    res.redirect("/books");
  }
}

module.exports = router;
