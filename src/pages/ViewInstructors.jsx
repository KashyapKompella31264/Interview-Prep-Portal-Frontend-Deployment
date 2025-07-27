import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2, FiEdit, FiPlus ,FiSearch} from 'react-icons/fi';

const ViewInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    expertise:'',
    experience:'',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAllInstructors();
  }, []);

  const fetchAllInstructors = async () => {
    try {
      const res = await fetch('https://interview-prep-portal-backend-application.onrender.com/admin/instructors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setInstructors(data);
    } catch (err) {
      console.error('Error fetching instructors:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return fetchAllInstructors();
    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/instructor/${searchId}`, {
        method:'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInstructors([data]);
      } else {
        alert('Instructor not found!');
        setInstructors([]);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleView = (instructor) => {
    setSelectedInstructor(instructor);
    setEditMode(false);
    setIsAdding(false);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/instructors/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAllInstructors();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleEdit = () => {
    setFormData(selectedInstructor);
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/instructors/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      setModalVisible(false);
      fetchAllInstructors();
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  const handleAddInstructor = async () => {
    const { name, email,password ,experience,expertise} = formData;
    if (!name || !email || !password || !experience || !expertise) {
      return alert('Please fill in all fields');
    }

    try {
      await fetch('https://interview-prep-portal-backend-application.onrender.com/admin/instructors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      setFormData({ name: '', email: '',password: '',expertise:'',experience:'',});
      setIsAdding(false);
      setModalVisible(false);
      fetchAllInstructors();
    } catch (err) {
      console.error('Add instructor error:', err);
    }
  };

  return (
    <div className="instructor-management">
      {/* Header Section */}
      <div className="management-header">
        <h2>Instructor Management</h2>
        <div className="action-bar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn-search" onClick={handleSearch}>Search</button>
          </div>
          <button 
            className="btn-add"
            onClick={() => {
              setFormData({ name: '', email: '', password: '', expertise: '', experience: '' });
              setIsAdding(true);
              setModalVisible(true);
            }}
          >
            <FiPlus /> Add Instructor
          </button>
        </div>
      </div>

      {/* Instructors Table */}
      <div className="instructors-table">
        {instructors.length > 0 ? (
          <>
            <div className="table-header">
              <div>ID</div>
              <div>Name</div>
              <div>Expertise</div>
              <div>Experience</div>
              <div>Actions</div>
            </div>
            <div className="table-body">
              {instructors.map((instructor) => (
                <div key={instructor.id} className="table-row">
                  <div>{instructor.id}</div>
                  <div>{instructor.name}</div>
                  <div>{instructor.expertise || 'N/A'}</div>
                  <div>{instructor.experience || 'N/A'}</div>
                  <div className="actions">
                    <button 
                      className="btn-action view"
                      onClick={() => handleView(instructor)}
                    >
                      <FiEye /> View
                    </button>
                    <button 
                      className="btn-action delete"
                      onClick={() => handleDelete(instructor.id)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            No instructors found. Try a different search or add new instructors.
          </div>
        )}
      </div>

      {/* Instructor Modal */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="instructor-modal">
            <h3>{isAdding ? 'Add New Instructor' : editMode ? 'Edit Instructor' : 'Instructor Details'}</h3>
            
            {editMode || isAdding ? (
              <div className="form-fields">
                {!isAdding && (
                  <div className="form-group">
                    <label>Instructor ID</label>
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
                <div className="form-row">
                  <div className="form-group">
                    <label>Expertise *</label>
                    <input
                      type="text"
                      value={formData.expertise}
                      onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Experience *</label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>
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
              </div>
            ) : (
              <div className="instructor-details">
                <div className="detail-row">
                  <span className="detail-label">ID:</span>
                  <span>{selectedInstructor.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span>{selectedInstructor.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span>{selectedInstructor.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Expertise:</span>
                  <span>{selectedInstructor.expertise || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Experience:</span>
                  <span>{selectedInstructor.experience || 'N/A'}</span>
                </div>
              </div>
            )}

            <div className="modal-actions">
              {editMode || isAdding ? (
                <button 
                  className="btn-save"
                  onClick={isAdding ? handleAddInstructor : handleSaveEdit}
                >
                  {isAdding ? 'Create Instructor' : 'Save Changes'}
                </button>
              ) : (
                <button 
                  className="btn-edit"
                  onClick={handleEdit}
                >
                  <FiEdit /> Edit Instructor
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
  );
};

export default ViewInstructors;
