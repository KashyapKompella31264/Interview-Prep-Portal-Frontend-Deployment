import { useEffect, useState } from "react";
import InstructorNavbar from "../components/InstructorNavbar";
import { useParams } from "react-router-dom";

const InstructorViewQuestion = () => {
    const { questionId } = useParams();
    const token = localStorage.getItem("token");

    // State management
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedQuestion, setEditedQuestion] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedTestcase, setEditedTestcase] = useState({ 
        input: "", 
        expectedOutput: "" 
    });

    // Fetch question data
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const res = await fetch(
                    `https://interview-prep-portal-backend-application.onrender.com/instructors/questions/${questionId}`, 
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch question");
                }

                const data = await res.json();
                setQuestion(data);
                setEditedQuestion({ ...data });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [questionId, token]);

    // Handle changes to general question fields
    const handleGeneralChange = (e) => {
        const { name, value } = e.target;
        setEditedQuestion(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    // Start editing a test case
    const handleTestcaseEditClick = (index) => {
        setEditingIndex(index);
        const tc = editedQuestion.testcases[index];
        setEditedTestcase({
            id: tc.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
        });
    };

    // Save edited test case
    const handleTestcaseSave = (index) => {
        const updatedTestcases = [...editedQuestion.testcases];
        updatedTestcases[index] = { ...editedTestcase };
        
        setEditedQuestion(prev => ({
            ...prev,
            testcases: updatedTestcases
        }));
        
        setEditingIndex(null);
        setEditedTestcase({ input: "", expectedOutput: "" });
    };

    // Cancel test case editing
    const handleTestcaseCancel = () => {
        setEditingIndex(null);
        setEditedTestcase({ input: "", expectedOutput: "" });
    };

    // Save all changes to the question
    const handleSaveAll = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const res = await fetch(
                `https://interview-prep-portal-backend-application.onrender.com/instructors/question/${questionId}`, 
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editedQuestion),
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update question");
            }

            const updated = await res.json();
            setQuestion(updated);
            setEditedQuestion(updated);
            setEditMode(false);
            setEditingIndex(null);
            setEditedTestcase({ input: "", expectedOutput: "" });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cancel all edits
    const handleCancelAll = () => {
        setEditedQuestion({ ...question });
        setEditMode(false);
        setEditingIndex(null);
        setEditedTestcase({ input: "", expectedOutput: "" });
        setError(null);
    };

    if (loading) {
        return (
            <div className="instructor-view-question">
                <InstructorNavbar />
                <div className="loading-container">Loading question...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="instructor-view-question">
                <InstructorNavbar />
                <div className="error-container">{error}</div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="instructor-view-question">
                <InstructorNavbar />
                <div className="error-container">Question not found</div>
            </div>
        );
    }

    return (
        <div className="instructor-view-question">
            <InstructorNavbar />
            
            <div className="question-header">
                <h1>Question Details</h1>
                <p className="question-id">ID: {question.id}</p>
            </div>

            <div className="question-details">
                {editMode ? (
                    <div className="edit-form">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={editedQuestion.title}
                                onChange={handleGeneralChange}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Difficulty</label>
                            <input
                                type="text"
                                name="difficulty"
                                value={editedQuestion.difficulty}
                                onChange={handleGeneralChange}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Category</label>
                            <input
                                type="text"
                                name="category"
                                value={editedQuestion.category}
                                onChange={handleGeneralChange}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={editedQuestion.description}
                                onChange={handleGeneralChange}
                                rows="6"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="view-mode">
                        <h2>{question.title}</h2>
                        <div className="meta-info">
                            <p><strong>Difficulty:</strong> {question.difficulty}</p>
                            <p><strong>Category:</strong> {question.category}</p>
                        </div>
                        <div className="description">
                            <h3>Description</h3>
                            <pre>{question.description}</pre>
                        </div>
                    </div>
                )}

                <div className="testcases-section">
                    <h3>Test Cases</h3>
                    
                    {editedQuestion.testcases.map((tc, index) => (
                        <div 
                            key={index} 
                            className={`testcase-card ${editingIndex === index ? 'editing' : ''}`}
                        >
                            {editingIndex === index ? (
                                <div className="testcase-edit-form">
                                    <div className="form-group">
                                        <label>Input</label>
                                        <textarea
                                            value={editedTestcase.input}
                                            onChange={(e) => 
                                                setEditedTestcase({ 
                                                    ...editedTestcase, 
                                                    input: e.target.value 
                                                })
                                            }
                                            rows="4"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Expected Output</label>
                                        <textarea
                                            value={editedTestcase.expectedOutput}
                                            onChange={(e) => 
                                                setEditedTestcase({ 
                                                    ...editedTestcase, 
                                                    expectedOutput: e.target.value 
                                                })
                                            }
                                            rows="2"
                                        />
                                    </div>
                                    
                                    <div className="form-actions">
                                        <button 
                                            className="save-btn"
                                            onClick={() => handleTestcaseSave(index)}
                                        >
                                            Save
                                        </button>
                                        <button 
                                            className="cancel-btn"
                                            onClick={handleTestcaseCancel}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="testcase-view">
                                    <div className="testcase-input">
                                        <h4>Input</h4>
                                        <pre>{tc.input}</pre>
                                    </div>
                                    
                                    <div className="testcase-output">
                                        <h4>Expected Output</h4>
                                        <pre>{tc.expectedOutput}</pre>
                                    </div>
                                    
                                    {editMode && (
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleTestcaseEditClick(index)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="main-actions">
                    {editMode ? (
                        <>
                            <button 
                                className="save-all-btn"
                                onClick={handleSaveAll}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save All Changes'}
                            </button>
                            <button 
                                className="cancel-all-btn"
                                onClick={handleCancelAll}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button 
                            className="edit-mode-btn"
                            onClick={() => setEditMode(true)}
                        >
                            Edit Question
                        </button>
                    )}
                </div>

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default InstructorViewQuestion;