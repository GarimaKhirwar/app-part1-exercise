import { useState, useEffect } from 'react'
import personService from './services/persons'
import { SearchFilter, AddPerson, ShowAllPeople } from './components/Phonebook'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const addName = (event) => {
    event.preventDefault()

    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    if (trimmedName === '' || trimmedNumber === '') {
      alert('Please enter both a name and a number')
      return
    }

    const existingPerson = persons.find(person => person.name === trimmedName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${trimmedName} is already added to phonebook. Replace the old number with a new one?`
      )

      if (!confirmUpdate) {
        return
      }

      const updatedPerson = { ...existingPerson, number: trimmedNumber }

      personService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person =>
            person.id !== existingPerson.id ? person : returnedPerson
          ))
          setNewName('')
          setNewNumber('')
        })
        .catch(() => {
          alert(`Information of ${trimmedName} has already been removed from server`)
          setPersons(persons.filter(person => person.id !== existingPerson.id))
        })

      return
    }

    const personObject = {
      name: trimmedName,
      number: trimmedNumber,
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        alert(`Could not add person: ${error}`)
      })
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (!person) return

    const confirmDelete = window.confirm(`Delete ${person.name}?`)
    if (!confirmDelete) return

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(() => {
        alert(`Information of ${person.name} was already removed from server`)
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const showAll = () => {
    setSearchTerm('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter
        searchTerm={searchTerm}
        handleSearchChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={showAll}>show all</button>

      <h3>add a new</h3>
      <AddPerson
        newName={newName}
        newNumber={newNumber}
        onNameChange={(e) => setNewName(e.target.value)}
        onNumberChange={(e) => setNewNumber(e.target.value)}
        onSubmit={addName}
      />

      <h2>Numbers</h2>
      <ShowAllPeople persons={filteredPersons} onDelete={deletePerson} />
    </div>
  )
}

export default App