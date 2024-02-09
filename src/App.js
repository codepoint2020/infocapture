import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ firstname: '', lastname: '', city: '' });
  const [records, setRecords] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState(''); // New state for confirmation message

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

   // Fetch records from Firebase
   useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    fetch('https://react-firebase-crud-de97c-default-rtdb.europe-west1.firebasedatabase.app/records.json')
    .then(response => response.json())
    .then(data => {
      const loadedRecords = [];
      for (const key in data) {
        loadedRecords.push({
          id: key,
          ...data[key]
        });
      }
      setRecords(loadedRecords);
    });
  }


  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update the record
      fetch(`https://react-firebase-crud-de97c-default-rtdb.europe-west1.firebasedatabase.app/records/${editingId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).then(() => {
          // Display confirmation message
        setConfirmationMessage('Record updated');
        // Remove the message after a few seconds
        setTimeout(() => {
          setConfirmationMessage('');
        }, 5000);
        fetchRecords(); // Refetch records to reflect the update
        setIsEditing(false);
        setEditingId(null);
        setFormData({ firstname: '', lastname: '', city: '' }); // Reset form
      });
    } else {
      // Add new record
      fetch('https://react-firebase-crud-de97c-default-rtdb.europe-west1.firebasedatabase.app/records.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).then(() => {
        fetchRecords(); // Refetch records to include the new one
        setFormData({ firstname: '', lastname: '', city: '' }); // Reset form
          // Display confirmation message
        setConfirmationMessage('New record added.');
        // Remove the message after a few seconds
        setTimeout(() => {
          setConfirmationMessage('');
        }, 5000);
      });
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  // Add methods for delete and update here
  const handleDelete = (id) => {
    fetch(`https://react-firebase-crud-de97c-default-rtdb.europe-west1.firebasedatabase.app/records/${id}.json`, {
      method: 'DELETE',
    }).then(() => {
      // Display confirmation message
      setConfirmationMessage('Record has been deleted.');
      // Remove the message after a few seconds
      setTimeout(() => {
        setConfirmationMessage('');
      }, 5000);

      // Update the UI by filtering out the deleted record
      setRecords(records.filter(record => record.id !== id));
    });
  };



  const handleEdit = (record) => {
    // Display confirmation message
    setConfirmationMessage('You\'r about to edit a record');
    // Remove the message after a few seconds
    setTimeout(() => {
      setConfirmationMessage('');
    }, 5000);

    setFormData({ firstname: record.firstname, lastname: record.lastname, city: record.city });
    setIsEditing(true);
    setEditingId(record.id);
  };


  return (
    <>
    {confirmationMessage && <p>{confirmationMessage}</p>} {/* Display confirmation message */}
    <div className="App">
      
      <div className="form-container">
      <div className="form-header"><h2>InfoCapture</h2></div>
      
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
            required
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
            required
            />
          {isEditing ? (
            <button type="submit" className='updateBtn'>Update</button>
          ) : (
            <button type="submit" className='addBtn'>Add Record</button>
          )}
        </form>
      </div>
      <div className="table-container">
      <h2>Cyberpunk World Citizens</h2>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id}>
                <td>{record.firstname}</td>
                <td>{record.lastname}</td>
                <td>{record.city}</td>
                <td>
                  <i onClick={() => handleEdit(record)} className='editBtn myBtn fa-solid fa-pen-to-square'></i>
          
                  <i type="button" onClick={() => handleDelete(record.id)} className='delBtn myBtn fa-solid fa-rectangle-xmark'></i>
              
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       
      </div>
      <div className="footer">
          © {new Date().getFullYear()} InfoCapture. All rights reserved.
        </div>
    </div>
    
    </>
    
  );
}

export default App;
