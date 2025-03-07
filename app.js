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
app.use(express.json());
// my Middleware
app.use(function (req, res, next) {
    //token extraction following this article's implementation
    //https://medium.com/@abolfazlmashhadi93/implementing-jwt-authentication-in-express-js-308e57b3fcbd#:~:text=Token%20Extraction%3A%20The%20token%20is,invalid%2C%20an%20error%20is%20returned.
        const bearerHead = req.headers["authorization"];
        if (!bearerHead || !bearerHead.startsWith("Bearer ")) {
            return res.send("where is ur token :scream:");
        }
        const token = bearerHead.split(" ")[1];
        if (token != "Zewail"){
            return res.send("wrong token :(")
        }
        console.log("Middleware called", counter++);
        next();
});

// I took the initialization parts from the documentation, and some test data 
const Book = mongoose.model('Book', BookScheme , "BooksCollection");
const User = mongoose.model('User', UserSchema , "UserCollection");
const Author = mongoose.model('Author', AuthorSchema , "AuthorCollection");


const bookRoutes = require("./routes/book")(Book);
const authorRoutes = require("./routes/authors")(Author);
const userRoutes = require("./routes/users")(User);

app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/authors", authorRoutes);


// a welcome message to guide you through the api when using postman :shrug:
app.get("/", (req, res) => {
    res.send("Hello, Use /books, /users, /authors for API endpoints followed by (add / delete/ update) :D.");
});



