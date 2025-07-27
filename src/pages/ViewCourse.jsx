import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
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
} from "react-icons/fi";

const ViewCourse = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [instructors, setInstructors] = useState([]);
    const [subTopics, setSubTopics] = useState([]);
    const [expandedSubTopics, setExpandedSubTopics] = useState({});
    const [expandedProblems, setExpandedProblems] = useState({});
    const [questions, setQuestions] = useState({});
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");  
    const [announcements, setAnnouncements] = useState([]);
    const [showAnnouncements, setShowAnnouncements] = useState(false);
    const [instructorMap, setInstructorMap] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token. Authorization required.");
                    return;
                }

                // Fetch course details
                const courseResponse = await fetch(`https://interview-prep-portal-backend-application.onrender.com/student/courses/${courseId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!courseResponse.ok) throw new Error("Failed to fetch course details.");
                const courseData = await courseResponse.json();
                setCourse(courseData);
                setInstructors(courseData.instructors || []);

                // Fetch subtopics if they exist
                if (courseData.subTopics && Array.isArray(courseData.subTopics)) {
                    const subTopicDetails = await Promise.all(
                        courseData.subTopics.map(async (subTopicId) => {
                            const response = await fetch(`https://interview-prep-portal-backend-application.onrender.com/student/getsubtopic/${subTopicId}`, {
                                method: "GET",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                },
                            });
                            if (!response.ok) throw new Error(`Failed to fetch subtopic with ID ${subTopicId}`);
                            return response.json();
                        })
                    );
                    setSubTopics(subTopicDetails);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Could not fetch course details.");
            }
        };

        fetchData();
    }, [courseId]);

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
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token. Authorization required.");
                return;
            }
            const response = await fetch(`https://interview-prep-portal-backend-application.onrender.com/student/getquestion/${questionId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error(`Failed to fetch question with ID ${questionId}`);
            const data = await response.json();
            setQuestions(prev => ({ ...prev, [questionId]: data }));
        } catch (error) {
            console.error("Error fetching question:", error);
            setError("Could not fetch question.");
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
                        "Content-Type": "application/json"
                    }
                });
                if (response.ok) {
                    const instructorData = await response.json();
                    fetchedMap[id] = instructorData.name;
                } else {
                    fetchedMap[id] = "Unknown Instructor";
                }
            }
        }));

        setInstructorMap(fetchedMap);
        setShowAnnouncements(!showAnnouncements);

        } catch (error) {
            console.error("Error fetching announcements:", error);
            setError("Failed to load announcements");
        }
    };

    return (
        <div className="course-details-container">
            <StudentNavbar />
            
            <main className="course-main-content">
                {error && (
                    <div className="error-banner">
                        <FiAlertTriangle /> {error}
                    </div>
                )}

                {course ? (
                    <div className="course-content">
                        {/* Course Header */}
                        <div className="course-header">
                            <div className="course-title-wrapper">
                                <h1 className="course-title">
                                    <FiBook className="header-icon" />
                                    {course.title}
                                </h1>
                                <button 
                                    onClick={fetchAnnouncements}
                                    className="announcements-button"
                                >
                                    <FiMessageSquare />
                                    {showAnnouncements ? 'Hide Announcements' : 'Show Announcements'}
                                </button>
                            </div>
                            <p className="course-description">{course.description}</p>
                        </div>

                        {/* Announcements Panel */}
                        {showAnnouncements && announcements.length > 0 && (
                            <div className="announcements-panel">
                                <h3 className="announcements-title">
                                    <FiMessageSquare />
                                    Announcements
                                </h3>
                                <div className="announcements-list">
                                    {announcements.map(announcement => (
                                        <div key={announcement.id} className="announcement-card">
                                            <div>
                                            <span><strong>Created By: </strong>{instructorMap[announcement.createdBy] || "Loading..."}</span>
                                            </div>
                                            <h4>{announcement.title}</h4>
                                            <p>{announcement.content}</p>
                                            <div className="announcement-meta">
                                                <span><FiClock /> {new Date(announcement.createdAt).toLocaleString()}</span>
                                                
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Course Content */}
                        <div className="course-grid">
                            {/* Instructors Section */}
                            <section className="instructors-section">
                                <h2 className="section-title">
                                    <FiUsers className="section-icon" />
                                    Instructors
                                </h2>
                                <div className="instructors-grid">
                                    {instructors.length > 0 ? (
                                        instructors.map(instructor => (
                                            <div key={instructor.id} className="instructor-card">
                                                <div className="instructor-avatar">
                                                    {instructor.name[0]}
                                                </div>
                                                <div className="instructor-info">
                                                    <h3>{instructor.name}</h3>
                                                    <p className="expertise">{instructor.expertise}</p>
                                                    <div className="instructor-contact">
                                                        {instructor.email && (
                                                            <p><FiMail /> {instructor.email}</p>
                                                        )}
                                                        {instructor.phone && (
                                                            <p><FiPhone /> {instructor.phone}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-state">No instructors assigned</div>
                                    )}
                                </div>
                            </section>

                            {/* Curriculum Section */}
                            <section className="curriculum-section">
                                <h2 className="section-title">
                                    <FiFileText className="section-icon" />
                                    Course Curriculum
                                </h2>
                                
                                {subTopics.length > 0 ? (
                                    <div className="subtopics-list">
                                        {subTopics.map(subTopic => (
                                            <div key={subTopic.id} className="subtopic-card">
                                                <div 
                                                    className="subtopic-header"
                                                    onClick={() => toggleSubTopic(subTopic.id)}
                                                >
                                                    <span className="toggle-icon">
                                                        {expandedSubTopics[subTopic.id] ? <FiChevronDown /> : <FiChevronRight />}
                                                    </span>
                                                    <h3 className="subtopic-title">{subTopic.title}</h3>
                                                </div>
                                                
                                                {expandedSubTopics[subTopic.id] && (
                                                    <div className="problems-list">
                                                        {subTopic.questions.length > 0 ? (
                                                            subTopic.questions.map(questionId => (
                                                                <div 
                                                                    key={questionId} 
                                                                    className="problem-card"
                                                                    onClick={() => toggleProblem(questionId)}
                                                                >
                                                                    <div className="problem-header">
                                                                        <FiCode className="problem-icon" />
                                                                        <span className="problem-title">
                                                                            Problem {questionId}
                                                                        </span>
                                                                    </div>
                                                                    
                                                                    {expandedProblems[questionId] && questions[questionId] && (
                                                                        <div className="problem-details">
                                                                            <h4>{questions[questionId].title}</h4>
                                                                            <div className="problem-meta">
                                                                                <span className="difficulty">
                                                                                    Difficulty: {questions[questionId].difficulty}
                                                                                </span>
                                                                                <span className="category">
                                                                                    Category: {questions[questionId].category}
                                                                                </span>
                                                                            </div>
                                                                            <Link 
                                                                                to={`/viewquestion/${questionId}`}
                                                                                className="solve-button"
                                                                            >
                                                                                Solve Problem
                                                                            </Link>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="empty-state">No problems in this subtopic</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state">No subtopics available</div>
                                )}
                            </section>
                        </div>
                    </div>
                ) : (
                    !error && (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            Loading course details...
                        </div>
                    )
                )}
            </main>
        </div>
    );
};

export default ViewCourse;