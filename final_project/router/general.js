const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user. Provide username and password."});
});

// Task 10: Get the book list available in the shop using Promises
public_users.get('/',function (req, res) {
  const get_books = new Promise((resolve, reject) => {
      resolve(res.send(JSON.stringify(books, null, 4)));
  });
  get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn',function (req, res) {
  const get_book_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    resolve(res.send(books[isbn]));
  });
  get_book_isbn.then(() => console.log("Promise for Task 11 resolved"));
});
  
// Task 12: Get book details based on author using Promises
public_users.get('/author/:author',function (req, res) {
  const get_books_author = new Promise((resolve, reject) => {
    const author = req.params.author;
    let booksByAuthor = [];
    for (let key in books) {
      if (books[key].author === author) {
        booksByAuthor.push(books[key]);
      }
    }
    resolve(res.send(JSON.stringify(booksByAuthor, null, 4)));
  });
  get_books_author.then(() => console.log("Promise for Task 12 resolved"));
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title',function (req, res) {
  const get_books_title = new Promise((resolve, reject) => {
    const title = req.params.title;
    let booksByTitle = [];
    for (let key in books) {
      if (books[key].title === title) {
        booksByTitle.push(books[key]);
      }
    }
    resolve(res.send(JSON.stringify(booksByTitle, null, 4)));
  });
  get_books_title.then(() => console.log("Promise for Task 13 resolved"));
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;