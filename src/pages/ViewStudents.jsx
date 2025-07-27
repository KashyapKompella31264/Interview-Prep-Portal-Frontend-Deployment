import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { FiUser, FiMail, FiEdit, FiTrash2, FiEye, FiPlus ,FiSearch} from 'react-icons/fi';

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    age: '',
    phno: '',
    address: '',
    password: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const res = await fetch('https://interview-prep-portal-backend-application.onrender.com/admin/getstudents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      fetchAllStudents();
      return;
    }
  
    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/student/${searchId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          setStudents([data]);
        } else {
          alert('Student not found!');
          // Don't clear the current list if search fails
        }
      } else {
        const message = await res.text();
        alert(`Student not found! (${res.status})\n${message}`);
        // Don't clear the current list
      }
    } catch (err) {
      console.error('Search error:', err);
      alert('An error occurred while searching.');
    }
  };
  

  const handleView = (student) => {
    setSelectedStudent(student);
    setEditMode(false);
    setIsAdding(false);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/student/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          alert('Student deleted successfully!');
          fetchAllStudents();
        } else {
          const errorText = await res.text();
          alert('Failed to delete: ' + errorText);
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Error deleting student');
      }
    }
  };

  const handleEdit = () => {
    setFormData(selectedStudent);
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/student/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Student updated successfully!');
        setModalVisible(false);
        fetchAllStudents();
      } else {
        const errorText = await res.text();
        alert('Failed to update: ' + errorText);
      }
    } catch (err) {
      console.error('Edit error:', err);
      alert('Error editing student');
    }
  };

  const handleAddStudent = async () => {
    const { name, email, age, phno, address, password } = formData;

    if (!name || !email || !password) {
      return alert('Please fill in all required fields: Name, Email, Password');
    }

    try {
      const res = await fetch('https://interview-prep-portal-backend-application.onrender.com/admin/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, age, phno, address, password }),
      });

      if (res.ok) {
        alert('Student added successfully!');
        setFormData({
          id: '',
          name: '',
          email: '',
          age: '',
          phno: '',
          address: '',
          password: '',
        });
        setIsAdding(false);
        setModalVisible(false);
        fetchAllStudents();
      } else {
        const errorText = await res.text();
        alert('Failed to add student: ' + errorText);
      }
    } catch (err) {
      console.error('Add student error:', err);
      alert('Error adding student');
    }
  };

  return (
    <div className="admin-student-management">
      
      
      <div className="student-management-container">
        {/* Header Section */}
        <div className="management-header">
          <h2>Student Management</h2>
          <div className="action-bar">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by student ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn-search" onClick={handleSearch}>Search</button>
            </div>
            <button 
              className="btn-add"
              onClick={() => {
                setFormData({ id: '', name: '', email: '', age: '', phno: '', address: '', password: '' });
                setIsAdding(true);
                setModalVisible(true);
              }}
            >
              <FiPlus /> Add New Student
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="students-table-container">
          <div className="table-header">
            <div className="header-cell">ID</div>
            <div className="header-cell">Name</div>
            <div className="header-cell">Email</div>
            <div className="header-cell">Phone</div>
            <div className="header-cell actions-cell">Actions</div>
          </div>

          <div className="table-body">
            {students.length > 0 ? (
              students.map((student) => (
                <div key={student.id} className="table-row">
                  <div className="table-cell">{student.id}</div>
                  <div className="table-cell">{student.name}</div>
                  <div className="table-cell">{student.email}</div>
                  <div className="table-cell">{student.phno || 'N/A'}</div>
                  <div className="table-cell actions-cell">
                    <button 
                      className="btn-action view"
                      onClick={() => handleView(student)}
                    >
                      <FiEye /> Details
                    </button>
                    <button 
                      className="btn-action delete"
                      onClick={() => handleDelete(student.id)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                No students found. Try a different search or add new students.
              </div>
            )}
          </div>
        </div>

        {/* Student Modal */}
        {modalVisible && (
          <div className="modal-overlay">
            <div className="student-modal">
              <h3>{isAdding ? 'Add New Student' : editMode ? 'Edit Student' : 'Student Details'}</h3>
              
              {editMode || isAdding ? (
                <div className="form-fields">
                  {!isAdding && (
                    <div className="form-group">
                      <label>Student ID</label>
                      <input type="text" value={formData.id} disabled />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password {isAdding && '*'}</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={isAdding ? 'Required' : 'Leave blank to keep current'}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        value={formData.phno}
                        onChange={(e) => setFormData({ ...formData, phno: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="student-details">
                  <div className="detail-row">
                    <span className="detail-label">ID:</span>
                    <span>{selectedStudent.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span>{selectedStudent.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span>{selectedStudent.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span>{selectedStudent.phno || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Age:</span>
                    <span>{selectedStudent.age || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Address:</span>
                    <span>{selectedStudent.address || 'N/A'}</span>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                {editMode || isAdding ? (
                  <button 
                    className="btn-save"
                    onClick={isAdding ? handleAddStudent : handleSaveEdit}
                  >
                    {isAdding ? 'Create Student' : 'Save Changes'}
                  </button>
                ) : (
                  <button 
                    className="btn-edit"
                    onClick={handleEdit}
                  >
                    <FiEdit /> Edit Student
                  </button>
                )}
                <button 
                  className="btn-close"
                  onClick={() => {
                    setModalVisible(false);
                    setIsAdding(false);
                    setEditMode(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudents;
