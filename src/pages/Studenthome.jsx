
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { FiBookOpen, FiArrowRight } from 'react-icons/fi';

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
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="instructor-home min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <StudentNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="course-header text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Your Learning Journey</h1>
          {error && (
            <div className="error-message flex items-center gap-2 animate-pulse bg-red-50 text-red-600 p-3 rounded-md mt-4 max-w-md mx-auto">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-container flex flex-col items-center justify-center py-16">
            <div className="loading-spinner border-t-4 border-blue-600 w-12 h-12 rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading your courses...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="course-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="course-card bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="card-header p-6">
                  <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                </div>
                
                <div className="instructor-section p-6 border-t border-gray-200">
                  <p className="course-description text-gray-600 text-sm mb-4">{course.description}</p>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Instructors:</h4>
                  <div className="instructor-list space-y-3">
                    {course.instructors?.map((instructor) => (
                      <div key={instructor.id} className="instructor-badge flex items-center gap-3">
                        <span className="instructor-avatar bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium">
                          {instructor.name[0]}
                        </span>
                        <div className="instructor-info">
                          <p className="instructor-name text-gray-800 font-medium">{instructor.name}</p>
                          <p className="instructor-expertise text-gray-500 text-sm">{instructor.expertise}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/studenthome/coursedetails/${course.id}`}
                  className="course-button w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-b-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg group"
                >
                  View Course
                  <FiArrowRight className="transform transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state flex flex-col items-center justify-center py-16 text-center">
            <FiBookOpen className="empty-icon text-blue-600 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">No courses enrolled yet</h3>
            <p className="text-gray-600 mt-2">Start your learning journey by enrolling in courses!</p>
            <Link to="/courses" className="mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Browse Courses
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Studenthome;