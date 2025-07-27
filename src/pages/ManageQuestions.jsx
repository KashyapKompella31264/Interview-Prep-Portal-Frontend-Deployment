import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseSideBar from '../components/CourseSideBar';
import AdminNavbar from '../components/AdminNavbar';
import { FiSearch, FiPlus, FiTrash2, FiEdit2, FiChevronDown, FiChevronUp, FiX, FiSave } from 'react-icons/fi';

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState({});
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    difficulty: 'EASY',
    category: '',
    sampleInput: '',
    sampleOutput: '',
    testcases: [],
    newTestCaseInput: '',
    newTestCaseOutput: ''
  });
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/questions`, {
        method:'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      alert("Failed to fetch questions");
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      fetchQuestions();
      return;
    }
    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/questions/${searchId}`, {
        method:'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions([data]);
      } else {
        alert("Question not found");
      }
    } catch (err) {
      alert("Search failed");
    }
  };
  const handleDeleltetestcase = async (tc,qid)=>{
    if(!window.confirm("Are you sure want to Delete this Testcase!!!")) return;
    {console.log(tc)}
    try{
      const res= await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/testcase/delete/${qid}`,{
        method:'POST',
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`,
        },
        body: JSON.stringify(tc),
      });
      const data= await res.text();
      console.log("data is:",data);
      if(res.ok){
        alert("Testcase DELETED");
        setEditedQuestion((prev) => ({
          ...prev,
          testcases: prev.testcases.filter(
            (t) => !(t.input === tc.input && t.expectedOutput === tc.expectedOutput)
          ),
        }));
        fetchQuestions();
      }
      else{
        alert("failed to delete Testcase");
      }
    }catch(error){
      alert(error);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/questions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert("Deleted");
        fetchQuestions();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      alert("Error deleting");
    }
  };

  const toggleExpand = (id) => {
    
    setEditingQuestionId(null); // collapse edit if open
    setExpandedQuestionId(prev => (prev === id ? null : id));
  };

  const handleEditClick = (question) => {
    setEditingQuestionId(question.id);
    setEditedQuestion({ ...question }); // pre-fill values
  };

  const handleEditChange = (field, value) => {
    setEditedQuestion((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const {
        newTestCaseInput,
        newTestCaseOutput,
        testcases,
        ...cleanedQuestion
      } = editedQuestion;
      console.log("id is",editedQuestion.id);
      // 1. Update the question details
      const updateResponse = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/questions/${editedQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedQuestion),
      });
  
      if (!updateResponse.ok) {
        alert("Failed to update question.");
        return;
      }
  
      // 2. Post new test cases only (if any)
      const newTestCases = editedQuestion.testcases?.filter(tc => !questions
        .find(q => q.id === editedQuestion.id)
        ?.testcases?.some(existing => existing.input === tc.input && existing.expectedOutput === tc.expectedOutput)
      );
  
      if (newTestCases && newTestCases.length > 0) {
        const testCaseResponse = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/${editedQuestion.id}/addTestCases`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTestCases),
        });
  
        if (!testCaseResponse.ok) {
          alert("Question updated, but failed to add test cases.");
        }
      }
  
      alert("Question updated successfully!");
      setEditingQuestionId(null);
      fetchQuestions(); // refresh
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Something went wrong.");
    }
  };
  const handleAddQuestion = async () => {
    const {
      title, description, difficulty, category,
      testcases
    } = newQuestion;

    if (!title || !description || !difficulty || !category || testcases.length === 0) {
      alert("Please fill all fields and add at least one test case.");
      return;
    }

    try {
      const res = await fetch("https://interview-prep-portal-backend-application.onrender.com/admin/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title, description, difficulty, category,
          testcases
        }),
      });

      if (res.ok) {
        alert("Question added!");
        setShowAddForm(false);
        setNewQuestion({
          title: '',
          description: '',
          difficulty: 'EASY',
          category: '',
          testcases: [],
          newTestCaseInput: '',
          newTestCaseOutput: ''
        });
        fetchQuestions();
      } else {
        alert("Failed to add question.");
      }
    } catch (err) {
      alert("Error adding question.");
    }
  };

  return (
    <div className="manage-questions-container">
      
      <div className="content-wrapper">
        <div className="header-section">
          <AdminNavbar/>
          
          <h2>Manage Questions</h2>
          <div className="search-add-container">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by Question ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="search-input"
              />
              <button onClick={handleSearch} className="search-button">
                Search
              </button>
            </div>
            <button onClick={() => setShowAddForm(true)} className="add-button">
              <FiPlus /> Add Question
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="modal-overlay">
            <div className="add-question-modal compact-modal">
              <div className="modal-header">
                <h3>Add New Question</h3>
                <button onClick={() => setShowAddForm(false)} className="close-button">
                  <FiX />
                </button>
              </div>
              
              <div className="compact-form-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input 
                    value={newQuestion.title} 
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })} 
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <input 
                    value={newQuestion.category} 
                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })} 
                  />
                </div>
                
                <div className="form-group">
                  <label>Difficulty</label>
                  <select 
                    value={newQuestion.difficulty} 
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={newQuestion.description} 
                  onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })} 
                  rows="3"
                />
              </div>

              <div className="test-cases-section">
                <h4>Test Cases</h4>
                <div className="test-cases-list compact-test-cases">
                  {newQuestion.testcases.map((tc, i) => (
                    <div key={i} className="test-case-item">
                      <div className="test-case-content">
                        <span><strong>Input:</strong> {tc.input}</span>
                        <span><strong>Output:</strong> {tc.expectedOutput}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setNewQuestion(prev => ({
                            ...prev,
                            testcases: prev.testcases.filter((_, index) => index !== i)
                          }));
                        }}
                        className="delete-testcase-button"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="compact-testcase-inputs">
                  <input 
                    placeholder="Input" 
                    value={newQuestion.newTestCaseInput} 
                    onChange={(e) => setNewQuestion({ ...newQuestion, newTestCaseInput: e.target.value })} 
                  />
                  <input 
                    placeholder="Expected Output" 
                    value={newQuestion.newTestCaseOutput} 
                    onChange={(e) => setNewQuestion({ ...newQuestion, newTestCaseOutput: e.target.value })} 
                  />
                  <button 
                    onClick={() => {
                      if (newQuestion.newTestCaseInput && newQuestion.newTestCaseOutput) {
                        setNewQuestion(prev => ({
                          ...prev,
                          testcases: [
                            ...prev.testcases,
                            {
                              input: prev.newTestCaseInput,
                              expectedOutput: prev.newTestCaseOutput
                            }
                          ],
                          newTestCaseInput: '',
                          newTestCaseOutput: ''
                        }));
                      } else {
                        alert("Please enter both input and expected output");
                      }
                    }}
                    className="add-testcase-button"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="modal-actions compact-actions">
                <button onClick={() => setShowAddForm(false)} className="cancel-button">
                  Cancel
                </button>
                <button onClick={handleAddQuestion} className="save-button">
                  <FiSave /> Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="questions-table-container compact-table">
          <table className="questions-table">
            <thead>
              <tr>
                <th width="10%">ID</th>
                <th width="30%">Title</th>
                <th width="15%">Difficulty</th>
                <th width="25%">Category</th>
                <th width="20%">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(questions || []).map((q) => (
                <React.Fragment key={q.id}>
                  <tr>
                    <td>{q.id}</td>
                    <td className="title-cell">{q.title}</td>
                    <td>
                      <span className={`difficulty-badge ${q.difficulty.toLowerCase()}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td>{q.category}</td>
                    <td>
                      <div className="action-buttons compact-actions">
                        <button 
                          onClick={() => toggleExpand(q.id)} 
                          className="view-button"
                        >
                          {expandedQuestionId === q.id ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        <button 
                          onClick={() => handleEditClick(q)} 
                          className="edit-button"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          onClick={() => handleDelete(q.id)} 
                          className="delete-button"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedQuestionId === q.id && (
                    <tr className="expanded-row">
                      <td colSpan="5">
                        <div className="question-details compact-details">
                          <div className="detail-section">
                            <label>Description:</label>
                            <div className="description-content">{q.description}</div>
                          </div>
                          
                          <div className="detail-section">
                            <label>Test Cases:</label>
                            <div className="test-cases-grid compact-testcases">
                              {q.testcases?.map((tc, idx) => (
                                <div key={idx} className="test-case-card">
                                  <div className="test-case-header">
                                    <span>Test Case #{idx + 1}</span>
                                  </div>
                                  <div className="test-case-body">
                                    <div>
                                      <strong>Input:</strong>
                                      <pre>{tc.input}</pre>
                                    </div>
                                    <div>
                                      <strong>Output:</strong>
                                      <pre>{tc.expectedOutput}</pre>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {editingQuestionId === q.id && (
                    <tr className="editing-row">
                      <td colSpan="5">
                        <div className="edit-question-form compact-edit-form">
                          <div className="compact-form-grid">
                            <div className="form-group">
                              <label>Title</label>
                              <input
                                value={editedQuestion.title}
                                onChange={(e) => handleEditChange("title", e.target.value)}
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Category</label>
                              <input
                                value={editedQuestion.category}
                                onChange={(e) => handleEditChange("category", e.target.value)}
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Difficulty</label>
                              <select
                                value={editedQuestion.difficulty}
                                onChange={(e) => handleEditChange("difficulty", e.target.value)}
                              >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="form-group">
                            <label>Description</label>
                            <textarea
                              value={editedQuestion.description}
                              onChange={(e) => handleEditChange("description", e.target.value)}
                              rows="3"
                            />
                          </div>

                          <div className="test-cases-section">
                            <h5>Test Cases</h5>
                            <div className="test-cases-list compact-test-cases">
                              {editedQuestion.testcases?.map((tc, idx) => (
                                <div key={idx} className="test-case-item">
                                  <div className="test-case-content">
                                    <span><strong>Input:</strong> {tc.input}</span>
                                    <span><strong>Output:</strong> {tc.expectedOutput}</span>
                                  </div>
                                  <button 
                                    onClick={() => handleDeleteTestcase(tc, q.id)}
                                    className="delete-testcase-button"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </div>
                              ))}
                            </div>
                            
                            <div className="compact-testcase-inputs">
                              <input
                                placeholder="Input"
                                value={editedQuestion.newTestCaseInput || ""}
                                onChange={(e) => setEditedQuestion(prev => ({ ...prev, newTestCaseInput: e.target.value }))}
                              />
                              <input
                                placeholder="Expected Output"
                                value={editedQuestion.newTestCaseOutput || ""}
                                onChange={(e) => setEditedQuestion(prev => ({ ...prev, newTestCaseOutput: e.target.value }))}
                              />
                              <button 
                                onClick={() => {
                                  const newTc = {
                                    input: editedQuestion.newTestCaseInput || "",
                                    expectedOutput: editedQuestion.newTestCaseOutput || "",
                                  };
                                  if (!newTc.input || !newTc.expectedOutput) {
                                    alert("Both fields are required");
                                    return;
                                  }

                                  setEditedQuestion(prev => ({
                                    ...prev,
                                    testcases: [...(prev.testcases || []), newTc],
                                    newTestCaseInput: "",
                                    newTestCaseOutput: ""
                                  }));
                                }}
                                className="add-testcase-button"
                              >
                                Add
                              </button>
                            </div>
                          </div>

                          <div className="form-actions compact-actions">
                            <button onClick={() => setEditingQuestionId(null)} className="cancel-button">
                              Cancel
                            </button>
                            <button onClick={handleSaveEdit} className="save-button">
                              <FiSave /> Save
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageQuestions;
