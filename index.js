const { response } = require('express')
const express = require('express')
const shortid = require('shortid')

const server = express()
const PORT = 2019

let users = []

server.use(express.json())

// Creates a user
server.post('/api/users', (req, res) => {
  const userInfo = req.body
  userInfo.id = shortid.generate()
  try {
    if (!userInfo.name || !userInfo.bio) {
      res
        .status(400)
        .json({ errorMessage: 'Please provide name and bio for the user' })
    } else {
      users.push(userInfo)
      response.status(201).json(userInfo)
    }
  } catch (err) {
    res.status(500).json({
      errorMessage: 'There was an error while saving the user to the database',
    })
  }
})

// Returns an array of users
server.get('/api/users', (req, res) => {
  try {
    res.status(200).res.json(users)
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'The users information could not be retrieved' })
  }
})

// Returns the user object with the specified id
server.get('/api/users/:id', (req, res) => {
  const { id } = req.params
  try {
    let found = users.find((user) => user.id === id)(found)
      ? res.status(200).json(found)
      : res
          .status(404)
          .json({ message: 'The user with the specified id does not exist' })
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'The user information could not be retrieved' })
  }
})

// Updates the user wiht the specified id and returns the modified user
server.put('/api/users/:id', (req, res) => {
  const { id } = req.params
  const changes = req.body
  changes.id = id
  try {
    if (!changes.name || !changes.bio) {
      res
        .status(400)
        .json({ errorMessage: 'Please provide name and bio for the user' })
    } else {
      let index = users.findIndex((user) => user.id === id)
      if (index !== -1) {
        users[index] = changes
        res.status(200).json(users[index])
      } else {
        res
          .status(404)
          .json({
            errorMessage: 'The user with the specified id does not exist',
          })
      }
    }
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'The user information could not be modified' })
  }
})

// Removes the user with the specified id and returns the deleted user
server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params
  try {
    const deleted = users.find((user) => user.id === id)
    if (deleted) {
      users = users.filter((user) => user.id !== id)
      res.status(200).json(deleted)
    } else {
      res
        .status(400)
        .json({ message: 'The user with the specified id does not exist' })
    }
  } catch (err) {
    res.status(500).json({ errorMessage: 'The user could not be removed' })
  }
})

server.listen(PORT, () => {
  console.log('listening on localhost: ', PORT)
})
