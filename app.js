const express = require("express")
const mongoose = require("mongoose")

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/Books").then(() => {app.listen(PORT, () => {console.log("ON");});})

counter = 0;

//Schemas, i was going to include them in their own js files but it seemed
//easier and more convienient for you to view them here instead of hopping
//between files
const BookScheme = new mongoose.Schema({
    id: Number, 
    title: String,
    borrowed: Boolean,
    AuthorID: Number
});
const UserSchema = new mongoose.Schema({
    id: Number, 
    password: String
});

const AuthorSchema = new mongoose.Schema({
    id: Number, 
    name: String
});

app.use(express.urlencoded({extended : true}));

// my Middleware
app.use(function (req, res, next) {
        console.log("Middleware called", counter++);
        next();
});

// I took the initialization parts from the documentation, and some test data 
const Book = mongoose.model('Book', BookScheme , "BooksCollection");
const User = mongoose.model('User', UserSchema , "UserCollection");
const Author = mongoose.model('Author', AuthorSchema , "AuthorCollection");

const bookRoutes = require("./routes/books")(Book);
const userRoutes = require("./routes/users")(User);
const authorRoutes = require("./routes/authors")(Author);

app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/authors", authorRoutes);


// a welcome message to guide you through the api when using postman :shrug:
app.get("/", (req, res) => {
    res.send("Hello, Use /books, /users, /authors for API endpoints followed by (add / delete/ update) :D.");
});



