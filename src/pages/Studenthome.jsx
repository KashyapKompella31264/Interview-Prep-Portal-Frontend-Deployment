import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentNavbar from "../components/StudentNavbar";

const Studenthome = () => {
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://interview-prep-portal-backend-application.onrender.com/student/courses`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          setError('Failed to fetch courses');
        }
      } catch (err) {
        setError('Error fetching courses');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    
    <div className="instructor-home">
      <StudentNavbar />
      
      <main >
        <div className="course-header">
          <h1>Your Learning Journey</h1>
          {error && <div className="error-message">{error}</div>}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your courses...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="course-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="card-header">
                  <h3>{course.title}</h3>
                  
                </div>
                
                
                
                <div className="instructor-section">
                <pre className="course-description">{course.description}</pre>
                  <h4>Instructors:</h4>
                  <div className="instructor-list">
                    {course.instructors?.map((instructor) => (
                      <div key={instructor.id} className="instructor-badge">
                        <span className="instructor-avatar">
                          {instructor.name[0]}
                        </span>
                        <div className="instructor-info">
                          <p className="instructor-name">{instructor.name}</p>
                          <p className="instructor-expertise">{instructor.expertise}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link 
                  to={`/studenthome/coursedetails/${course.id}`}
                  className="course-button"
                >
                  View Course
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No courses enrolled yet</h3>
            <p>Start your learning journey by enrolling in courses!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Studenthome;