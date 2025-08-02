import { useState, useEffect } from 'react';
import { isTokenExpired } from './utils/auth';
import { Route, Routes, useNavigate } from 'react-router-dom'; // Import useNavigate
import './App.css';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Adminhome from './pages/Adminhome';
import Studenthome from './pages/Studenthome';
import Instructorhome from './pages/Instructorhome';
import ProtectedRoute from './components/ProtectedRoute';
import ViewStudentProfile from './pages/ViewStudentProfile';
import CourseDetails from './pages/CourseDetails';
import StudentCourses from './pages/StudentCourses';
import ViewCourse from './pages/ViewCourse';
import ViewQuestion from './pages/ViewQuestion';
import StudentSection from './pages/StudentSection';
import InstructorSection from './pages/InstructorSection';
import ViewStudents from './pages/ViewStudents';
import ViewCourses from './pages/ViewCourses';
import ManageSubTopics from './pages/ManageSubTopics';
import ManageQuestions from './pages/ManageQuestions';
import MyCourses from './pages/MyCourses';
import InstructorCoursePage from './pages/InstructorCoursePage';
import Announcements from './pages/Announcements';
import InstructorViewStudents from './pages/InstructorViewStudents';
import PrepareQuestion from './pages/PrepareQuestion';
import InstructorProfile from './pages/InstructorProfile';
import InstructorViewQuestion from './pages/InstructorViewQuestion';
function App() {
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const checkTokenExpiration = () => {
        if (isTokenExpired(token)) {
          localStorage.removeItem('token'); // Clear expired token
          localStorage.removeItem('role'); // Clear role
          navigate('/login'); // Redirect to login using navigate
        }
      };

      // Check token expiration every minute
      const interval = setInterval(checkTokenExpiration, 60000);

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [navigate]); // Add navigate to the dependency array

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/adminhome"
        element={
          <ProtectedRoute>
            <Adminhome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/studenthome"
        element={
          <ProtectedRoute>
            <Studenthome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructorhome"
        element={
          <ProtectedRoute>
            <Instructorhome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/viewstudentprofile"
        element={
          <ProtectedRoute>
            <ViewStudentProfile />
          </ProtectedRoute>
        }
        
      />
      <Route
        path="/studenthome/Coursedetails/:id"
        element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        }
        
      />
    <Route 
      path='/studentcourses' 
      element={
        <ProtectedRoute>
          <StudentCourses/>
        </ProtectedRoute>
      }
    />
    <Route
      path='/viewcourse/:courseId'
      element={
        <ProtectedRoute>
          <ViewCourse/>
        </ProtectedRoute>
      }
    />
    <Route 
      path='/viewquestion/:questionId' 
      element={
        <ProtectedRoute>
          <ViewQuestion/>
        </ProtectedRoute>
      } />
    <Route 
      path='/managestudents' 
      element={
        <ProtectedRoute>
          <StudentSection/>
        </ProtectedRoute>
      } />
    <Route 
      path='/manageinstructors' 
      element={
        <ProtectedRoute>
          <InstructorSection/>
        </ProtectedRoute>
      } />
    <Route
      path='/viewcourses' 
      element={
        <ProtectedRoute>
          <ViewCourses/>
        </ProtectedRoute>
      } />
    <Route
      path='/viewstudent' 
      element={
        <ProtectedRoute>
          <ViewStudents/>
        </ProtectedRoute>
      } />
    <Route
      path='/subtopics' 
      element={
        <ProtectedRoute>
          <ManageSubTopics/>
        </ProtectedRoute>
      } />
    <Route 
      path='/managequestions'
      element={
        <ProtectedRoute>
          <ManageQuestions/>
        </ProtectedRoute>
      }
    />
    <Route
      path='/mycourses'
      element={
        <ProtectedRoute>
          <MyCourses/>
        </ProtectedRoute>
      }
    />
    <Route
      path='/gotocourse/:courseId'
      element={
        <ProtectedRoute>
          <InstructorCoursePage/>
        </ProtectedRoute>
      }
    />
    <Route
      path='/Announcements'
      element={
        <ProtectedRoute>
          <Announcements/>
        </ProtectedRoute>
      }
    />
    <Route
      path='/viewstudents'
      element={
        <ProtectedRoute>
          <InstructorViewStudents/>
        </ProtectedRoute>
      }
    />
    <Route
      path='/preparequestions'
      element={
        <ProtectedRoute>
          <PrepareQuestion/>
        </ProtectedRoute>
      }
    />
    <Route
      path='/instructorprofile'
      element={
        <ProtectedRoute>
          <InstructorProfile/>
        </ProtectedRoute>
      }
    />
    <Route
      path='/instructor/viewquestion/:questionId'
      element={
        <ProtectedRoute>
          <InstructorViewQuestion/>
        </ProtectedRoute>
      }
    />
    </Routes>

  );
}

export default App;
