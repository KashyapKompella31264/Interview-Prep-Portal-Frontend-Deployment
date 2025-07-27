import { useEffect, useState } from "react";
import InstructorNavbar from "../components/InstructorNavbar";

const InstructorViewStudents = () => {
    const [students, setStudents] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const token = localStorage.getItem("token");

    // Fetch all students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const res = await fetch(
                    `https://interview-prep-portal-backend-application.onrender.com/instructors/student/getallstudents`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch students");
                }

                const data = await res.json();
                setStudents(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [token]);

    // Search student by ID
    const getStudentById = async () => {
        if (!searchId.trim()) {
            // If search field is empty, fetch all students
            fetchStudents();
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const res = await fetch(
                `https://interview-prep-portal-backend-application.onrender.com/instructors/student/${searchId}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (!res.ok) {
                throw new Error("Student not found");
            }

            const data = await res.json();
            if (data) {
                setStudents([data]);
                setSelectedStudent(data);
            } else {
                setError("No student found with that ID");
                fetchStudents();
            }
        } catch (error) {
            setError(error.message);
            fetchStudents();
        } finally {
            setLoading(false);
        }
    };

    // Refetch all students
    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const res = await fetch(
                `https://interview-prep-portal-backend-application.onrender.com/instructors/student/getallstudents`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch students");
            }

            const data = await res.json();
            setStudents(data);
            setSelectedStudent(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle key press in search input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            getStudentById();
        }
    };

    if (loading && students.length === 0) {
        return (
            <div className="instructor-view-students">
                <InstructorNavbar />
                <div className="loading-container">Loading students...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="instructor-view-students">
                <InstructorNavbar />
                <div className="error-container">
                    {error}
                    <button onClick={fetchStudents} className="retry-btn">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="instructor-view-students">
            <InstructorNavbar />
            
            <div className="header-section">
                <h1>Student Management</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by Student ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button 
                        onClick={getStudentById}
                        className="search-btn"
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                    <button 
                        onClick={fetchStudents}
                        className="reset-btn"
                        disabled={loading}
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="content-section">
                {/* Student Details Panel */}
                {selectedStudent && (
                    <div className="student-details-panel">
                        <h2>Student Details</h2>
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span>{selectedStudent.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Name:</span>
                            <span>{selectedStudent.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Email:</span>
                            <span>{selectedStudent.email}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Phone:</span>
                            <span>{selectedStudent.phno || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Address:</span>
                            <span>{selectedStudent.address || 'N/A'}</span>
                        </div>
                    </div>
                )}

                {/* Students List */}
                <div className="students-list">
                    <h2>{searchId ? 'Search Results' : 'All Students'}</h2>
                    
                    {students.length > 0 ? (
                        <table className="students-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr 
                                        key={student.id}
                                        className={selectedStudent?.id === student.id ? 'selected' : ''}
                                    >
                                        <td>{student.id}</td>
                                        <td>{student.name}</td>
                                        <td>
                                            <button 
                                                onClick={() => setSelectedStudent(student)}
                                                className="view-btn"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-results">
                            No students found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorViewStudents;