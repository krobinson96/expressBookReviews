const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body.user;
  if(!username || !password){
    return res.status(400).json({message:"Invalid username or password"})
  }
  if(users.find(user => user.username == username)){
    return res.status(400).json({message:"Username already exists"})
  }
  users.push({username, password});
  return res.status(200).send(`User ${username} has been registered`)
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    bookList = [];
    Object.keys(books).forEach((book) => {
        if(books[book].author == author){
            bookList.push(books[book]);
        }
    })
    return res.status(200).send(JSON.stringify({bookList}, null, 4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let titledBook;
    Object.keys(books).forEach((book) => {
        if(books[book].title == title){
            titledBook = books[book];
        }
    })
    return res.status(200).send(JSON.stringify({titledBook}, null, 4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let reviews = books[isbn].reviews;
  return res.status(200).send(JSON.stringify({reviews}, null, 4));
});

module.exports.general = public_users;
