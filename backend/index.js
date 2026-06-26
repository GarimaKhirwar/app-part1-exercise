const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

// Custom morgan format to display POST request data
morgan.token('body', (req) => JSON.stringify(req.body))
const morganFormat = ':method :url :status :res[content-length] - :response-time ms :body'

// Middleware
app.use(express.json())
app.use(morgan(morganFormat))
app.use(express.static('public'))

let persons = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
  const currentDate = new Date()
  const totalEntries = persons.length

  const infoHtml = `
    <p>Phonebook has info for ${totalEntries} people</p>
    <p>${currentDate}</p>
  `

  response.send(infoHtml)
})

// Get all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Get person by ID
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

// Custom morgan format function to display request body for POST requests
const morganBody = (tokens, req, res) => {
  const method = tokens.method(req, res)
  const url = tokens.url(req, res)
  const status = tokens.status(req, res)
  const responseTime = tokens['response-time'](req, res)
  const body = req.body ? JSON.stringify(req.body) : ''
  
  return `${method} ${url} ${status} - ${responseTime}ms ${body}`
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name and number required' 
    })
  }

  // Check for duplicates
  if (persons.some(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.status(201).json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



