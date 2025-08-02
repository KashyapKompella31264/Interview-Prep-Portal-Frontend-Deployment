import React, { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiEye, FiEdit,FiSearch } from 'react-icons/fi';
import AdminNavbar from "../components/AdminNavbar";
import { useNavigate } from 'react-router-dom';
import CourseSideBar from '../components/CourseSideBar';
const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructors: '',
    subTopics: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [expandedSubTopics, setExpandedSubTopics] = useState([]);
  const navigate=useNavigate();
  const token = localStorage.getItem('token');

  const fetchAllCourses = async () => {
    try {
      const response = await fetch('https://interview-prep-portal-backend-application.onrender.com/admin/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchSubtopics = async (courseId) => {
    try {
      const response = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/courses/${courseId}/subtopics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error fetching subtopics');
      return await response.json(); // Assumes each subtopic includes questions
    } catch (error) {
      console.error('Error fetching subtopics:', error);
      return [];
    }
  };

  const fetchCourseById = async (id) => {
    try {
      const response = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/courses/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Course not found');
      const data = await response.json();
      const subTopics = await fetchSubtopics(data.id);
      setSelectedCourse({ ...data, subTopics });
      setFormData({
        title: data.title,
        description: data.description,
        instructors: data.instructors.map((inst) => inst.id).join(', '),
        subTopics: subTopics.map(sub => sub.id).join(', ')
      });
      setEditMode(false);
      setIsAdding(false);
      setExpandedSubTopics([]);
    } catch (error) {
      console.error('Error fetching course:', error);
      setSelectedCourse(null);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const handleSearch = () => {
    if (searchId.trim() === '') {
      fetchAllCourses();
    } else {
      fetchCourseById(searchId);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllCourses();
      if (selectedCourse?.id === id) {
        setSelectedCourse(null);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleView = async (course) => {
    await fetchCourseById(course.id);
  };

  const handleEdit = () => {
    setEditMode(true);
    setIsAdding(false);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedCourse = {
        title: formData.title,
        description: formData.description,
        instructors: formData.instructors.split(',').map(id => id.trim()),
        subTopics: formData.subTopics.split(',').map(id => id.trim())
      };

      await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/courses/${selectedCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedCourse)
      });

      fetchAllCourses();
      fetchCourseById(selectedCourse.id);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleAddCourse = async () => {
    try {
      const newCourse = {
        title: formData.title,
        description: formData.description,
        instructors: formData.instructors.split(',').map(id => id.trim()),
        subTopics:formData.subTopics.split(',').map(id=>id.trim())
      };

      await fetch('https://interview-prep-portal-backend-application.onrender.com/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });

      fetchAllCourses();
      setIsAdding(false);
      setFormData({ title: '', description: '', instructors: '', subTopics: '' });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const toggleSubTopic = (index) => {
    setExpandedSubTopics(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="course-management">
      
      <div className="course-layout">
        
        
        <main className="course-main">
        <AdminNavbar/>
          <div className="course-header">
          
            <h2>Course Management</h2>
            <div className="search-add-container">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by Course ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="search-btn" onClick={handleSearch}>Search</button>
              </div>
              <button 
                className="add-btn"
                onClick={() => {
                  setIsAdding(true);
                  setEditMode(false);
                  setSelectedCourse(null);
                  setFormData({ title: '', description: '', instructors: '', subtopics: '' });
                }}
              >
                <FiPlus /> Add Course
              </button>
            </div>
          </div>

          <div className="courses-container">
            <div className="courses-list">
              {courses.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>ID: {course.id}</p>
                    <p className="description">{course.description.substring(0, 50)}...</p>
                  </div>
                  <div className="course-actions">
                    <button onClick={() => handleView(course)} className="view-btn">
                      <FiEye /> View
                    </button>
                    <button onClick={() => handleDelete(course.id)} className="delete-btn">
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {(isAdding || selectedCourse) && (
              <div className="course-details-panel">
                <h3>{isAdding ? 'Add New Course' : selectedCourse.title}</h3>
                
                {editMode || isAdding ? (
                  <div className="course-form">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Instructor IDs (comma separated)</label>
                      <input
                        type="text"
                        value={formData.instructors}
                        onChange={(e) => setFormData({ ...formData, instructors: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Subtopic IDs (comma separated)</label>
                      <input
                        type="text"
                        value={formData.subTopics}
                        onChange={(e) => setFormData({ ...formData, subTopics: e.target.value })}
                      />
                    </div>
                    <div className="form-actions">
                      <button 
                        onClick={isAdding ? handleAddCourse : handleSaveEdit}
                        className="save-btn"
                      >
                        {isAdding ? 'Add Course' : 'Save Changes'}
                      </button>
                      <button 
                        onClick={() => {
                          setIsAdding(false);
                          setEditMode(false);
                          if (selectedCourse) fetchCourseById(selectedCourse.id);
                        }}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="course-view">
                    <div className="course-meta">
                      <p><strong>ID:</strong> {selectedCourse.id}</p>
                      <p><strong>Description:</strong> {selectedCourse.description}</p>
                      <p><strong>Instructors:</strong> {selectedCourse.instructors.map(i => i.name || i.id).join(', ')}</p>
                    </div>
                    
                    <div className="subtopics-section">
                      <h4>Subtopics</h4>
                      {selectedCourse.subTopics.length > 0 ? (
                        selectedCourse.subTopics.map((sub, idx) => (
                          <div key={sub.id} className="subtopic-item">
                            <div 
                              className="subtopic-header"
                              onClick={() => toggleSubTopic(idx)}
                            >
                              <span className="toggle-icon">
                                {expandedSubTopics.includes(idx) ? '▼' : '▶'}
                              </span>
                              {sub.title} (ID: {sub.id})
                            </div>
                            {expandedSubTopics.includes(idx) && (
                              <div className="subtopic-content">
                                {sub.questions && sub.questions.length > 0 ? (
                                  <ul>
                                    {sub.questions.map((qId) => (
                                      <li key={qId}>Question ID: {qId}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>No questions available</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p>No subtopics assigned to this course</p>
                      )}
                    </div>
                    
                    <div className="course-actions">
                      <button onClick={handleEdit} className="edit-btn">
                        <FiEdit /> Edit Course
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewCourses;
