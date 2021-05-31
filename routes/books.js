const express = require("express");
const author = require("../models/author");
const router = express.Router();
const Book = require("../models/Book");
const Author = require("../models/author");
const { route } = require(".");

const imageMimeType = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

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
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.desp,
  });
  saveCover(book, req.body.cover);
  try {
    const newBook = await book.save();
    res.redirect(`books/${newBook.id}`);
  } catch (error) {
    renderNewPage(res, book, true);
  }
});

// Show Book Route
router.get("/:id", async (req, res) => {
  try {
    const bookInfo = await Book.findById(req.params.id)
      .populate("author")
      .exec();
    console.log("My debugging Code  " + bookInfo);
    res.render("books/show", { bookInfo: bookInfo });
  } catch (error) {
    res.redirect("/");
  }
});

// Edit Book Route
router.get("/:id/edit", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const allAuthors = await Author.find({}); // getting all authors books

    res.render("books/edit", {
      book: book,
      authors: allAuthors,
    });
  } catch (error) {
    res.redirect("/books");
  }
});
// updating the book Route
router.put("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = new Date(req.body.publishDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.desp;
    if (req.body.cover !== null && req.body.cover !== "") {
      saveCover(book, req.body.cover);
    }
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch (error) {
    if (book !== null) {
      renderEditPage(res, book, true);
    } else {
      res.redirect("/");
    }
  }
});
// deleting book
router.delete("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.remove();
    res.redirect(`/books`);
  } catch (error) {
    if (book === null) {
      res.redirect("/");
    } else {
      res.redirect(`/books/${book.id}`);
    }
  }
});

// functions Code
async function renderNewPage(res, book, hasError = false) {
  try {
    const allAuthors = await Author.find({}); // getting all authors books
    const params = {
      book: book,
      authors: allAuthors,
    };
    if (hasError)
      params.errorMessage = "Error while creating or Updating Books";
    res.render("books/new", params);
  } catch (error) {
    res.redirect("/books");
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded === null) return;
  const cover = JSON.parse(coverEncoded);

  if (cover !== null && imageMimeType.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

// main authors Code

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, "edit", hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating Book";
      } else {
        params.errorMessage = "Error Creating Book";
      }
    }
    res.render(`books/${form}`, params);
  } catch {
    res.redirect("/books");
  }
}

module.exports = router;
