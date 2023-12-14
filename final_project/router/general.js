const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if (!username)
  {
      return res.status(400).json({message:"empty username"})
  }

  if (!password)
  {
      return res.status(400).json({message:"empty password"})
  }

  if (isValid(username))
  {
    return res.status(400).json({message:"User already exists. No user created."})
  }

  users.push({
    "username":username,
    "password":password
  })

  return res.status(200).json({message:"User created successfully."})

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    let queryPromise = new Promise((resolve,reject)=>{
      resolve(JSON.stringify({books},null,4)+'\n');
    })
    
    queryPromise.then((output)=>{return res.send(output)})
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let queryPromise = new Promise((resolve,reject)=>
  {
    let isbnNum = req.params.isbn
    if (books.hasOwnProperty(isbnNum))
    {
        resolve(JSON.stringify(books[isbnNum],null,4)+'\n')
    }
    else
    {
        reject({ errorNum:404, errorMsg:"isbn of book not found" })
    }
  })

  queryPromise.then(
      (output)=>
      {
        return res.send(output)
      },
      (err)=>
      {
        let errorNum = err.errorNum
        let errorMsg = err.errorMsg
        return res.status(errorNum).json({message:errorMsg})
      }
  )
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let queryPromise = new Promise((resolve,reject)=>
  {
    let author = req.params.author
    let bookKeys = Object.keys(books)
    let retvals = []
    for (const key of bookKeys)
    {
        if (books[key].author === author)
        {
            retvals.push(books[key])
        }
    }

    if (retvals.length > 0)
    {
        resolve(JSON.stringify(retvals,null,4)+'\n')
    }
    else
    {
        reject({ errorNum:404, errorMsg:"author of book not found" })
    }
  })
  
  queryPromise.then((output)=>
  {
    return res.send(output)
  },
  (err)=>{
    let errorNum = err.errorNum
    let errorMsg = err.errorMsg
    return res.status(errorNum).json({message:errorMsg})
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let queryPromise = new Promise((resolve,reject)=>
    {
        let title = req.params.title
        let bookKeys = Object.keys(books)
        let retvals = []
        for (const key of bookKeys)
        {
          if (books[key].title === title)
          {
              retvals.push(books[key])
          }
        }
        
        if (retvals.length > 0)
        {
            resolve(JSON.stringify(retvals,null,4)+'\n')
        }
        else
        {
            reject({ errorNum:404, errorMsg:"title of book not found" })
        }
    })

    queryPromise.then((output)=>
    {
      return res.send(output)
    },
    (err)=>{
      let errorNum = err.errorNum
      let errorMsg = err.errorMsg
      return res.status(errorNum).json({message:errorMsg})
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbnNum = req.params.isbn
  if (books.hasOwnProperty(isbnNum))
  {
      return res.send(JSON.stringify(books[isbnNum].reviews,null,4)+'\n')
  }
  else
  {
      return res.status(404).json({message:"isbn of book not found"})
  }
});

module.exports.general = public_users;
