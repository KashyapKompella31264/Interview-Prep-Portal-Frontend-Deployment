
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { 
  FiBook, 
  FiChevronDown, 
  FiChevronRight, 
  FiCode, 
  FiUsers, 
  FiFileText, 
  FiAlertTriangle,
  FiMessageSquare,
  FiClock,
  FiPhone,
  FiMail
} from 'react-icons/fi';

const ViewCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const [expandedSubTopics, setExpandedSubTopics] = useState({});
  const [expandedProblems, setExpandedProblems] = useState({});
  const [questions, setQuestions] = useState({});
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [instructorMap, setInstructorMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          setError('No token. Authorization required.');
          return;
        }

        // Fetch course details
        const courseResponse = await fetch(`https://interview-prep-portal-backend-application.onrender.com/student/courses/${courseId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!courseResponse.ok) throw new Error('Failed to fetch course details.');
        const courseData = await courseResponse.json();
        setCourse(courseData);
        setInstructors(courseData.instructors || []);

        // Fetch subtopics if they exist
        if (courseData.subTopics && Array.isArray(courseData.subTopics)) {
          const subTopicDetails = await Promise.all(
            courseData.subTopics.map(async (subTopicId) => {
              const response = await fetch(`https://interview-prep-portal-backend-application.onrender.com/student/getsubtopic/${subTopicId}`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              if (!response.ok) throw new Error(`Failed to fetch subtopic with ID ${subTopicId}`);
              return response.json();
            })
          );
          setSubTopics(subTopicDetails);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Could not fetch course details.');
      }
    };

    fetchData();
  }, [courseId, token]);

  const toggleSubTopic = (subTopicId) => {
    setExpandedSubTopics(prev => ({
      ...prev,
      [subTopicId]: !prev[subTopicId]
    }));
  };

  const toggleProblem = async (questionId) => {
    if (!questions[questionId]) {
      await fetchQuestion(questionId);
    }
    setExpandedProblems(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const fetchQuestion = async (questionId) => {
    try {
      if (!token) {
        setError('No token. Authorization required.');
        return;
      }
      const response = await fetch(`https://interview-prep-portal-backend-application.onrender.com/student/getquestion/${questionId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch question with ID ${questionId}`);
      const data = await response.json();
      setQuestions(prev => ({ ...prev, [questionId]: data }));
    } catch (error) {
      console.error('Error fetching question:', error);
      setError('Could not fetch question.');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/student/getannouncements/course/${courseId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();
      setAnnouncements(data);

      // Fetch instructor names for each unique createdBy ID
      const uniqueInstructorIds = [...new Set(data.map(a => a.createdBy))];
      const fetchedMap = { ...instructorMap };

      await Promise.all(uniqueInstructorIds.map(async (id) => {
        if (!fetchedMap[id]) {
          const response = await fetch(`https://interview-prep-portal-backend-application.onrender.com/student/getinstructor/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const instructorData = await response.json();
            fetchedMap[id] = instructorData.name;
          } else {
            fetchedMap[id] = 'Unknown Instructor';
          }
        }
      }));

      setInstructorMap(fetchedMap);
      setShowAnnouncements(!showAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('Failed to load announcements');
    }
  };

  return (
    <div className="course-details-container min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <StudentNavbar />
      
      <main className="course-main-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="error-banner flex items-center gap-2 animate-pulse bg-red-50 text-red-600 p-3 rounded-md mb-6 max-w-2xl mx-auto">
            <FiAlertTriangle className="w-5 h-5 text-red-500" />
            {error}
          </div>
        )}

        {course ? (
          <div className="course-content">
            {/* Course Header */}
            <div className="course-header mb-8">
              <div className="course-title-wrapper flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="course-title text-3xl font-bold tracking-tight text-gray-800 flex items-center gap-2">
                  <FiBook className="header-icon text-blue-500" />
                  {course.title}
                </h1>
                <button 
                  onClick={fetchAnnouncements}
                  className="announcements-button bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
                >
                  <FiMessageSquare />
                  {showAnnouncements ? 'Hide Announcements' : 'Show Announcements'}
                </button>
              </div>
              <p className="course-description text-gray-600 text-sm mt-4">{course.description}</p>
            </div>

            {/* Announcements Panel */}
            {showAnnouncements && announcements.length > 0 && (
              <div className="announcements-panel bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="announcements-title text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <FiMessageSquare className="text-blue-500" />
                  Announcements
                </h3>
                <div className="announcements-list space-y-4">
                  {announcements.map(announcement => (
                    <div key={announcement.id} className="announcement-card border border-gray-200 rounded-md p-4">
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Created By: </strong>{instructorMap[announcement.createdBy] || 'Loading...'}
                      </div>
                      <h4 className="text-base font-medium text-gray-800">{announcement.title}</h4>
                      <p className="text-gray-600 text-sm">{announcement.content}</p>
                      <div className="announcement-meta text-gray-500 text-sm mt-2 flex items-center gap-2">
                        <FiClock />
                        <span>{new Date(announcement.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Content */}
            <div className="course-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Instructors Section */}
              <section className="instructors-section">
                <h2 className="section-title text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <FiUsers className="section-icon text-blue-500" />
                  Instructors
                </h2>
                <div className="instructors-grid grid grid-cols-1 gap-4">
                  {instructors.length > 0 ? (
                    instructors.map(instructor => (
                      <div key={instructor.id} className="instructor-card bg-white rounded-lg shadow-md p-4 flex items-start gap-4 hover:shadow-lg transition-all duration-200">
                        <div className="instructor-avatar bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-medium">
                          {instructor.name[0]}
                        </div>
                        <div className="instructor-info">
                          <h3 className="text-base font-medium text-gray-800">{instructor.name}</h3>
                          <p className="expertise text-gray-600 text-sm">{instructor.expertise}</p>
                          <div className="instructor-contact text-gray-600 text-sm mt-2 space-y-1">
                            {instructor.email && (
                              <p className="flex items-center gap-2"><FiMail /> {instructor.email}</p>
                            )}
                            {instructor.phone && (
                              <p className="flex items-center gap-2"><FiPhone /> {instructor.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state text-gray-600 text-center py-4">No instructors assigned</div>
                  )}
                </div>
              </section>

              {/* Curriculum Section */}
              <section className="curriculum-section lg:col-span-2">
                <h2 className="section-title text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <FiFileText className="section-icon text-blue-500" />
                  Course Curriculum
                </h2>
                
                {subTopics.length > 0 ? (
                  <div className="subtopics-list space-y-4">
                    {subTopics.map(subTopic => (
                      <div key={subTopic.id} className="subtopic-card bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                        <div 
                          className="subtopic-header p-4 flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleSubTopic(subTopic.id)}
                        >
                          <span className="toggle-icon text-blue-500">
                            {expandedSubTopics[subTopic.id] ? <FiChevronDown /> : <FiChevronRight />}
                          </span>
                          <h3 className="subtopic-title text-base font-medium text-gray-800">{subTopic.title}</h3>
                        </div>
                        
                        {expandedSubTopics[subTopic.id] && (
                          <div className="problems-list p-4 space-y-3 border-t border-gray-200">
                            {subTopic.questions.length > 0 ? (
                              subTopic.questions.map(questionId => (
                                <div 
                                  key={questionId} 
                                  className="problem-card bg-gray-50 rounded-md p-3 hover:bg-gray-100 transition-all duration-200"
                                  onClick={() => toggleProblem(questionId)}
                                >
                                  <div className="problem-header flex items-center gap-2 cursor-pointer">
                                    <FiCode className="problem-icon text-blue-500" />
                                    <span className="problem-title text-gray-800 font-medium">Problem {questionId}</span>
                                  </div>
                                  
                                  {expandedProblems[questionId] && questions[questionId] && (
                                    <div className="problem-details mt-3 text-sm text-gray-600">
                                      <h4 className="text-base font-medium text-gray-800">{questions[questionId].title}</h4>
                                      <div className="problem-meta flex flex-col sm:flex-row gap-2 mt-2">
                                        <span className="difficulty">Difficulty: {questions[questionId].difficulty}</span>
                                        <span className="category">Category: {questions[questionId].category}</span>
                                      </div>
                                      <Link 
                                        to={`/viewquestion/${questionId}`}
                                        className="solve-button inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg"
                                        aria-label={`Solve problem ${questions[questionId].title}`}
                                      >
                                        Solve Problem
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="empty-state text-gray-600 text-center py-4">No problems in this subtopic</div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state text-gray-600 text-center py-4">No subtopics available</div>
                )}
              </section>
            </div>
          </div>
        ) : (
          !error && (
            <div className="loading-container flex flex-col items-center justify-center py-16">
              <div className="loading-spinner border-t-4 border-blue-600 w-12 h-12 rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4 text-lg">Loading course details...</p>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default ViewCourse;