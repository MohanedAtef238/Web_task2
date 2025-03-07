const express = require("express");
// allocating the passed Author object to use in this wrapper
module.exports = (Book) => {
const router = express.Router();
    //regular getter function 
    router.get("/", async (req, res) => {
            const nBooks = await Book.find();
            if(nBooks != null) res.json(nBooks);  
            else res.send("Failed"); 
    });
    //this can remain as post since we're adding a whole new object
    router.post("/add", async (req, res) => {
        try {
            const newBook = new Book({
                id: req.body.id,
                title: req.body.title,
                borrowed: false,
                AuthorID: req.body.AuthorID
            });
            await newBook.save();
            res.send("Book added");
        } catch (error) {
            res.send("Failed");
        }
    });
    // used patch instead of put after the insightful article you shared with us :D 
    // from what i understood, i will be passing parameters along with the id whatever changes will be updated, assuming there is a field
    // thats requiring it 
    router.patch("/update/:id", async (req, res) => {
        try {
            // i had no idea how this function behaves but i followed some stackoverflow post to there
            // https://mongoosejs.com/docs/api/query.html#Query.prototype.findOneAndUpdate()
            // and i saw the new = true property which i havent used before, and still not using now
            // if its of significant importance would you let us know :D 
            const updatedBook = await Book.findOneAndUpdate({ id: req.params.id }, req.body);
            if (!updatedBook) {return res.send("not found");}
            res.send("Book updated");
        } catch (error) {
            res.send("Failed");
        }
    });

    router.patch("/borrow/:id", async (req, res) => {
        try{
           const borrowedB =  await Book.findOne({ id: req.params.id })
           if (!borrowedB ) res.send("doesn't exist")
            else if (borrowedB.borrowed) res.send("book already borrowed")
                else {
                        borrowedB.borrowed = true;
                        await borrowedB.save();
                        res.send("borrowed !");
        }
        } catch {
            res.send("to2 to2")
        }
    })

    router.patch("/unborrow/:id", async (req, res) => {
        try{
           const borrowedB =  await Book.findOne({ id: req.params.id })
           if (!borrowedB ) res.send("doesn't exist")
            else if (!borrowedB.borrowed) res.send("book unborrowed")
                else {
                        borrowedB.borrowed = false;
                        await borrowedB.save();
                        res.send("unborrowed !");
        }
        } catch {
            res.send("to2 to2")
        }
    })
    return router;
};