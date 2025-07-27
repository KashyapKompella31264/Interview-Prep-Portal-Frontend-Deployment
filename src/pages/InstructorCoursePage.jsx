import { useParams } from "react-router-dom";
import InstructorNavbar from "../components/InstructorNavbar";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const InstructorCoursePage = () => {
  const { courseId } = useParams();
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const instructorId = decodedToken.id;

  // State management
  const [loading, setLoading] = useState({
    course: true,
    subtopics: true,
    students: false,
    announcements: false
  });
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [questionsMap, setQuestionsMap] = useState({});
  const [questionInputs, setQuestionInputs] = useState({});
  const [studentDetails, setStudentDetails] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ 
    title: '', 
    content: '' 
  });
  const [showAnnouncementSection, setShowAnnouncementSection] = useState(false);

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(prev => ({ ...prev, course: true }));
        const courseRes = await fetch(`https://interview-prep-portal-backend-application.onrender.com/instructors/courses/${courseId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!courseRes.ok) throw new Error("Failed to fetch course");
        
        const courseData = await courseRes.json();
        setCourse(courseData);
        
        if (courseData.subTopics?.length > 0) {
          await fetchSubtopics(courseData.subTopics);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(prev => ({ ...prev, course: false }));
      }
    };

    fetchCourseData();
  }, [courseId, token]);

  // Fetch subtopics and questions
  const fetchSubtopics = async (subtopicIds) => {
    try {
      setLoading(prev => ({ ...prev, subtopics: true }));
      
      const subtopicPromises = subtopicIds.map(id =>
        fetch(`https://interview-prep-portal-backend-application.onrender.com/instructors/subtopic/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }).then(res => res.json())
      );

      const subtopicsData = await Promise.all(subtopicPromises);
      setSubtopics(subtopicsData);
      
      // Fetch questions for each subtopic
      const questionsBySubtopic = {};
      
      for (const subtopic of subtopicsData) {
        if (subtopic.questions?.length > 0) {
          const questionPromises = subtopic.questions.map(qId =>
            fetch(`https://interview-prep-portal-backend-application.onrender.com/instructors/questions/${qId}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              }
            }).then(res => res.json())
          );
          
          questionsBySubtopic[subtopic.id] = await Promise.all(questionPromises);
        }
      }
      
      setQuestionsMap(questionsBySubtopic);
      
    } catch (error) {
      setError(`Failed to fetch subtopics: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, subtopics: false }));
    }
  };

  // Handle adding a question to subtopic
  const handleAddQuestion = async (subtopicId) => {
    const questionId = questionInputs[subtopicId]?.trim();
    if (!questionId) {
      setError("Please enter a valid Question ID");
      return;
    }

    try {
      const res = await fetch(
        `https://interview-prep-portal-backend-application.onrender.com/instructors/subtopic/${subtopicId}/question/${questionId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add question");
      }

      // Refresh the subtopics and questions
      await fetchSubtopics(course.subTopics);
      setQuestionInputs(prev => ({ ...prev, [subtopicId]: "" }));
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch registered students
  const fetchRegisteredStudents = async () => {
    try {
      setLoading(prev => ({ ...prev, students: true }));
      setError(null);
      
      const res = await fetch(
        `https://interview-prep-portal-backend-application.onrender.com/instructors/course/${courseId}/getstudents`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch student IDs");
      
      const studentIds = await res.json();
      await fetchStudentDetails(studentIds);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  // Fetch student details
  const fetchStudentDetails = async (studentIds) => {
    try {
      const studentDetailsPromises = studentIds.map(studentId =>
        fetch(`https://interview-prep-portal-backend-application.onrender.com/instructors/student/${studentId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }).then(res => res.json())
      );

      const studentData = await Promise.all(studentDetailsPromises);
      setStudentDetails(studentData);
    } catch (error) {
      setError(`Failed to fetch student details: ${error.message}`);
    }
  };

  // Announcement functions
  const fetchAnnouncements = async () => {
    try {
      setLoading(prev => ({ ...prev, announcements: true }));
      setError(null);
      
      const res = await fetch(
        `https://interview-prep-portal-backend-application.onrender.com/instructors/announcements/${courseId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch announcements");
      
      const data = await res.json();
      setAnnouncements(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, announcements: false }));
    }
  };

  const postAnnouncement = async () => {
    try {
      if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
        setError("Title and content are required");
        return;
      }

      const announcementPayload = {
        ...newAnnouncement,
        createdBy: instructorId,
        courseId: courseId,
      };

      const res = await fetch(
        `https://interview-prep-portal-backend-application.onrender.com/instructors/announcements/addannouncement`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(announcementPayload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to post announcement");
      }

      setNewAnnouncement({ title: "", content: "" });
      await fetchAnnouncements();
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAnnouncementSection = () => {
    if (!showAnnouncementSection) {
      fetchAnnouncements();
    }
    setShowAnnouncementSection(!showAnnouncementSection);
  };

  // Clear announcement form
  const clearAnnouncementForm = () => {
    setNewAnnouncement({ title: "", content: "" });
    setError(null);
  };

  if (loading.course) return (
    <div>
      <InstructorNavbar />
      <div className="loading-container">Loading course details...</div>
    </div>
  );

  if (error) return (
    <div>
      <InstructorNavbar />
      <div className="error-container">{error}</div>
    </div>
  );

  return (
    <div className="instructor-course-page">
      <InstructorNavbar />
      
      <div className="course-header">
        <h1>{course?.title || "Course Details"}</h1>
        {course && (
          <div className="course-meta">
            <p><strong>Course ID:</strong> {course.id}</p>
            <p><strong>Description:</strong> {course.description}</p>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button 
          onClick={toggleAnnouncementSection}
          className="announcement-toggle"
        >
          {showAnnouncementSection ? "Hide Announcements" : "Show Announcements"}
        </button>
        <button 
          onClick={fetchRegisteredStudents}
          disabled={loading.students}
        >
          {loading.students ? "Loading..." : "Get Registered Students"}
        </button>
      </div>

      {/* Announcements Section */}
      {showAnnouncementSection && (
        <div className="announcements-section">
          <h2>Announcements</h2>
          
          <div className="announcement-form">
            <h3>Create New Announcement</h3>
            <input
              type="text"
              placeholder="Title"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({
                ...newAnnouncement,
                title: e.target.value
              })}
            />
            <textarea
              placeholder="Content"
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({
                ...newAnnouncement,
                content: e.target.value
              })}
              rows={4}
            />
            <div className="form-actions">
              <button onClick={postAnnouncement}>
                Post Announcement
              </button>
              <button onClick={clearAnnouncementForm}>
                Clear
              </button>
            </div>
          </div>

          <div className="announcements-list">
            <h3>Recent Announcements</h3>
            {loading.announcements ? (
              <p>Loading announcements...</p>
            ) : announcements.length > 0 ? (
              <ul>
                {announcements.map((announcement, index) => (
                  <li key={index} className="announcement-item">
                    <h4>{announcement.title}</h4>
                    <p>{announcement.content}</p>
                    <small>
                      Posted on: {new Date(announcement.createdAt).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No announcements yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Course Subtopics Section */}
      <div className="subtopics-section">
        <h2>Course Subtopics</h2>
        {loading.subtopics ? (
          <p>Loading subtopics...</p>
        ) : subtopics.length > 0 ? (
          <div className="subtopics-list">
            {subtopics.map((subtopic) => (
              <div key={subtopic.id} className="subtopic-card">
                <h3>{subtopic.title}</h3>
                <p><strong>Subtopic ID:</strong> {subtopic.id}</p>
                
                <div className="questions-section">
                  <h4>Questions</h4>
                  {Array.isArray(questionsMap[subtopic.id]) && questionsMap[subtopic.id].length > 0 ? (
  <ul className="questions-list">
    {questionsMap[subtopic.id].map((question, i) =>
      question ? (
        <li key={question.id || i}>
          <a 
            href={`/instructor/viewquestion/${question.id}`}
            className="question-link"
          >
            <strong>ID:</strong> {question.id} - {question.title}
          </a>
        </li>
      ) : null
    )}
  </ul>
) : (
  <p>No questions for this subtopic</p>
)}

                </div>

                <div className="add-question-form">
                  <input
                    type="text"
                    placeholder="Enter Question ID"
                    value={questionInputs[subtopic.id] || ""}
                    onChange={(e) => setQuestionInputs({
                      ...questionInputs,
                      [subtopic.id]: e.target.value
                    })}
                  />
                  <button 
                    onClick={() => handleAddQuestion(subtopic.id)}
                    disabled={!questionInputs[subtopic.id]?.trim()}
                  >
                    Add Question
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No subtopics available for this course.</p>
        )}
      </div>

      {/* Students Section */}
      {studentDetails.length > 0 && (
        <div className="students-section">
          <h2>Registered Students</h2>
          <ul className="students-list">
            {studentDetails.map((student) => (
              <li key={student.id} className="student-item">
                <strong>ID:</strong> {student.id} - <strong>Name:</strong> {student.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
export default InstructorCoursePage;