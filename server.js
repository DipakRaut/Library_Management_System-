if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // this will load all the variables from .env file
}
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");

const bodyParser = require("body-parser"); //it makes easy to access the different input elements from our actual server

const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to the Database...."));

app.use("/", indexRouter);
app.use("/authors", authorRouter); // this authors from routes authors and routes from authorRouter will appended to the /authors/here
app.use("/books", bookRouter);

app.listen(process.env.PORT || 3000);
