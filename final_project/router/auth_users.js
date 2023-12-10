const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let existing = users.filter((user)=>{return user.username===username})
    return existing.length > 0
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    if (!username || !password)
    {
        return false;
    }

    let authList = users.filter((user)=>{ return user.username === username && user.password === password})
    return authList.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password

  if (authenticatedUser(username, password))
  {
    let accessToken = jwt.sign
    (
      {data:password},
      'access',
      {expiresIn:60*60}
    )

    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  }
  else
  {
      return res.status(208).send("Invalid Login.")
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let user = req.session.authorization.username
  let review = req.body.review
  let isbn = req.params.isbn
  if (books.hasOwnProperty(isbn))
  {
      let book = books[isbn]
      book.reviews[user] = review

      //console.log(books[isbn])
      return res.status(200).json({message:user+" review updated"})
  }
  else
  {
      return res.status(404).json({message:"book isbn not found"})
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let user = req.session.authorization.username
    let isbn = req.params.isbn
    if (books.hasOwnProperty(isbn))
    {
        let book = books[isbn]
        if (book.reviews.hasOwnProperty(user))
        {
            book.reviews = Object.fromEntries(Object.entries(book.reviews).filter(([key,val])=>{return key !== user}))
            //console.log(books[isbn])
            return res.status(200).json({message:user+" review deleted successfully"})
        }
        else
        {
            return res.status(404).json({message:`book review for ${user} with ${isbn} not found`})
        }
    }
    else
    {
        return res.status(404).json({message:"book isbn not found"})
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
