const SearchFilter = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      filter shown with: <input value={searchTerm} onChange={handleSearchChange} />
    </div>
  )
}

const AddPerson = ({ newName, newNumber, onNameChange, onNumberChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const ShowAllPeople = ({ persons, onDelete }) => {
  return (
    <ul>
      {persons.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => onDelete(person.id)}>delete</button>
        </li>
      ))}
    </ul>
  )
}

export { SearchFilter, AddPerson, ShowAllPeople }
