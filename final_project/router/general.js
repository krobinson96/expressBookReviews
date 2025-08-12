const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = async () => {
    return books;
}

public_users.post("/register", (req,res) => {
  const {username, password} = req.body.user;
  if(!username || !password){
    return res.status(400).json({message:"Invalid username or password"})
  }
  if(users.find(user => user.username == username)){
    return res.status(400).json({message:"Username already exists"})
  }
  users.push({username, password});
  return res.status(200).send(`User ${username} has been registered\n${JSON.stringify({users}, null, 4)}`)
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify({bookList}, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const bookList = await getBooks();
    if(bookList[isbn]){
        return res.status(200).send(JSON.stringify(bookList[isbn], null, 4))
    } else {return res.status(404).json({message:`ISBN ${isbn} not found`})}
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    const nBooks = await getBooks();
    bookList = [];
    Object.keys(nBooks).forEach((book) => {
        if(nBooks[book].author == author){
            bookList.push(nBooks[book]);
        }
    })
    return res.status(200).send(JSON.stringify({bookList}, null, 4))
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const nBooks = await getBooks();
    let titledBook;
    Object.keys(nBooks).forEach((book) => {
        if(nBooks[book].title == title){
            titledBook = nBooks[book];
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
