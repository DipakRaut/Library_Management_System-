const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/Book");
// const MySchema = require("../models/author");

// All authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions.name);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
    // console.log(searchOptions.name);
  } catch (error) {
    res.redirect("/");
  }
});

// New Author Route just for displaying the form
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() }); // creating new author
});

// Create Author Route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });

  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch (error) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error Creating User",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const authors = await Author.findById(req.params.id);
    const books = await Book.find({ author: authors.id }).limit(6).exec();
    res.render("authors/show", { bookByAuthor: books, author: authors });
  } catch (error) {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch (error) {
    res.redirect("/authors");
  }
});

// for updating the Authors
router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (error) {
    if (author === null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        errorMessage: "Error Creating User",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect(`/authors`);
  } catch (error) {
    if (author === null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
