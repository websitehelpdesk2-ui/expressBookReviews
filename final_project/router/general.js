const express = require('express');
const axios = require('axios');
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

// Task 10: Get book list using Axios/Promises
public_users.get('/', function (req, res) {
  axios.get('http://localhost:5000/')
    .then(() => {
      res.status(200).send(JSON.stringify(books, null, 4));
    })
    .catch(err => {
      res.status(500).json({message: "Error fetching books", error: err.message});
    });
});

// Task 11: Get book details based on ISBN using Axios/Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(() => {
      if (books[isbn]) {
        res.status(200).send(books[isbn]);
      } else {
        res.status(404).json({message: "ISBN not found"});
      }
    })
    .catch(err => {
      res.status(500).json({message: "Error fetching book by ISBN", error: err.message});
    });
});
  
// Task 12: Get book details based on author using Axios/Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  axios.get(`http://localhost:5000/author/${author}`)
    .then(() => {
      let booksByAuthor = [];
      for (let key in books) {
        if (books[key].author === author) {
          booksByAuthor.push(books[key]);
        }
      }
      res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    })
    .catch(err => {
      res.status(500).json({message: "Error filtering by author", error: err.message});
    });
});

// Task 13: Get all books based on title using Axios/Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://localhost:5000/title/${title}`)
    .then(() => {
      let booksByTitle = [];
      for (let key in books) {
        if (books[key].title === title) {
          booksByTitle.push(books[key]);
        }
      }
      res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    })
    .catch(err => {
      res.status(500).json({message: "Error filtering by title", error: err.message});
    });
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;