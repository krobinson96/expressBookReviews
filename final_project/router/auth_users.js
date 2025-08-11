const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    if(username){
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let ret = false;
    users.forEach((user) => {
        if(user.username == username && user.password == password){
            ret = true;
        }
    });
    return ret;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.user;
    if(!user.username || !user.password){
        return res.status(400).json({message: `Password required for ${user.username}`})
    }
    if (!authenticatedUser(user.username,user.password)){
        return res.status(401).json({message: `Invalid password for user ${user.username}`})
    }
    let accessToken = jwt.sign({data: user}, 'access', {expiresIn: 60 * 60})
    req.session.authorization = {accessToken}
    return res.status(200).send(`User ${user.username} successfully logged in!\n ${JSON.stringify({users}, null, 4)}`)
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const user = jwt.decode(req.session.authorization.accessToken).data

    books[isbn].reviews[user.username] = review;
    return res.status(200).send(`Added ${user.username}'s review to book ${isbn}`)
});

// Remove a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const user = jwt.decode(req.session.authorization.accessToken).data
    delete books[isbn].reviews[user.username];
    return res.status(200).send(`Removed ${user.username}'s review from book ${isbn}`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
