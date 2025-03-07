const express = require("express");
// allocating the passed User object to use in this wrapper
module.exports = (User) => {
    const router = express.Router();
    //regular getter function 
    router.get("/", async (req, res) => {
            const Users = await User.find();
            if(Users != null) res.json(Users);  
            else res.send("Failed"); 
    });
    //this can remain as post since we're adding a whole new object
    router.post("/add", async (req, res) => {
        try {
            //these will be passed in postman, i ditched the old html formal for a more
            //intuitive testing approach
            const newUser = new User({id: req.body.id,password: req.body.password});
            await newUser.save();
            res.send("user added"); 
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
            const updatedUser = await User.findOneAndUpdate({ id: req.params.id },req.body);
            if (!updatedUser) {return res.send("user not found");}
            else res.send("user updated");
        } catch (error) {
            res.send("Failed");
        }
    });
    return router;
};