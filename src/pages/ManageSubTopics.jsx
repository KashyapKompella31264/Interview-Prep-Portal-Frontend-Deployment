import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CourseSideBar from "../components/CourseSideBar";
import AdminNavbar from '../components/AdminNavbar';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronRight } from 'react-icons/fi';
const ManageSubTopics = () => {
  const [searchId, setSearchId] = useState("");
  const [subtopic, setSubtopic] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editedQuestions, setEditedQuestions] = useState({});
  const [isEditingSubtopic, setIsEditingSubtopic] = useState(false);
  const [questionsData, setQuestionsData] = useState({});
  const [questionDetails, setQuestionDetails] = useState({});
  const [newQuestionId, setNewQuestionId] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSubtopics();
  }, [refresh]);

  
  
  useEffect(() => {
    if (subtopic?.questions?.length > 0) {
      const initialEdits = {};
      subtopic.questions.forEach((q) => {
        initialEdits[q.id] = { title: q.title, description: q.description };
      });
      setEditedQuestions(initialEdits);
    }
  }, [subtopic]);

  const fetchSubtopics = async () => {
    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/getsubtopics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSubtopics(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch subtopics.");
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return alert("Please enter a Subtopic ID");

    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/subtopic/${searchId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSubtopic(data);
      setIsEditingSubtopic(false);
    } catch {
      alert("Failed to fetch the subtopic.");
    }
  };

  const handleViewSubtopic = async (id) => {
    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/subtopic/${id}`,{
        method:'POST',
        headers:{Authorization:`Bearer ${token}`},
      }

      );
      const fetchedSubtopic = await res.json();
      setSubtopic(fetchedSubtopic);
      console.log(fetchedSubtopic);
      // Fetch all question objects from the list of IDs
      const questionDetails = {};
      for (let qId of fetchedSubtopic.questions) {
        const qRes = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/questions/${qId}`,{
          method:'POST',
          headers:{Authorization:`Bearer ${token}`},
        });
        questionDetails[qId] = await qRes.json();
      }
      setQuestionsData(questionDetails);
    } catch (err) {
      console.error("Error fetching subtopic/questions:", err);
    }
  };
  
  const handleaddquestiontosubtopic =async(questionId,subtopicId)=>{
    console.log("Subtopic to be added is:",subtopicId);
    console.log("Question to be added is: ",questionId);
    try{
      const res=await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/subtopic/${subtopicId}/questions/${questionId}`,{
        method:'POST',
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json",
      },
      });
      const data=await res.json();
      if(res.ok){
        alert("Question added succefully");
        handleViewSubtopic(subtopicId);
      }else{
        alert("Failed to add subtopic");
      }

    }catch(error){
      alert(error);
    }
  };
  const handleQuestionUpdate = async (questionId, updatedData) => {
    console.log("Updated Data",updatedData);
    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/questions/${questionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        alert("Question updated");
        handleViewSubtopic(subtopic.id);
      } else {
        alert("Failed to update question");
      }
    } catch {
      alert("Error updating question");
    }
  };

  
  
  const handleQuestionDelete = async (questionId,subtopicId) => {
    console.log("Question and subtopic id:",questionId,subtopicId);
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    
    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/removequestionfromsubtopic/${subtopicId}/${questionId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data=await res.text();
      console.log("data:",data);
      if (res.ok) {
        alert(data);
        handleViewSubtopic(subtopic.id);
      } else {
        alert("Failed to delete question");
      }
    } catch (error){
      alert(error);
    }
  };

  const handleSubtopicEdit = () => {
    setEditTitle(subtopic.title);
    setIsEditingSubtopic(true);
  };

  const handleSubtopicUpdate = async () => {
    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/subtopic/${subtopic.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle }),
      });

      if (res.ok) {
        alert("Subtopic updated successfully");
        handleViewSubtopic(subtopic.id);
        setIsEditingSubtopic(false);
        setRefresh((prev) => !prev);
      } else {
        alert("Failed to update subtopic");
      }
    } catch {
      alert("Error while updating");
    }
  };

  const handleDeleteSubtopic = async (subtopicId) => {
    if (!window.confirm("Are you sure you want to delete this subtopic?")) return;

    try {
      const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/admin/subtopic/${subtopicId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Subtopic deleted");
        setRefresh((prev) => !prev);
        if (subtopic?.id === subtopicId) setSubtopic(null);
      } else {
        alert("Failed to delete subtopic");
      }
    } catch {
      alert("Error deleting subtopic");
    }
  };

  return (
    <div className="subtopic-management">
      
      <div className="subtopic-layout">
        
        
        
        <main className="subtopic-main">
        <AdminNavbar />
          <div className="subtopic-header">
            <h2>Manage Subtopics</h2>
            <div className="controls">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by Subtopic ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="search-btn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="subtopic-content">
            {/* Selected Subtopic Panel */}
            {subtopic && (
              <div className="selected-subtopic">
                <div className="subtopic-details">
                  <div className="detail-header">
                    <h3>Subtopic Details</h3>
                    {isEditingSubtopic ? (
                      <div className="edit-controls">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="edit-input"
                        />
                        <button 
                          className="save-btn"
                          onClick={handleSubtopicUpdate}
                        >
                          Save
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={() => setIsEditingSubtopic(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button 
                          className="edit-btn"
                          onClick={handleSubtopicEdit}
                        >
                          <FiEdit2 /> Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteSubtopic(subtopic.id)}
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="detail-body">
                    <p><strong>ID:</strong> {subtopic.id}</p>
                    {!isEditingSubtopic && <p><strong>Title:</strong> {subtopic.title}</p>}
                    
                    <div className="questions-section">
                      <h4>Questions</h4>
                      <div className="add-question">
                        <input
                          type="text"
                          placeholder="Enter Question ID"
                          value={newQuestionId}
                          onChange={(e) => setNewQuestionId(e.target.value)}
                        />
                        <button 
                          className="add-btn"
                          onClick={() => handleaddquestiontosubtopic(newQuestionId, subtopic.id)}
                        >
                          <FiPlus /> Add Question
                        </button>
                      </div>

                      {subtopic.questions?.length > 0 ? (
                        <ul className="questions-list">
                          {subtopic.questions.map((id, index) => {
                            const q = questionsData[id];
                            if (!q) return null;
                            
                            return (
                              <li key={q.id || index}>
                                <div className="question-item">
                                  <div className="question-info">
                                    <p><strong>ID:</strong> {q.id}</p>
                                    {editedQuestions[q.id]?.isEditing ? (
                                      <div className="edit-question">
                                        <input
                                          type="text"
                                          value={editedQuestions[q.id]?.title || ""}
                                          onChange={(e) =>
                                            setEditedQuestions((prev) => ({
                                              ...prev,
                                              [q.id]: {
                                                ...prev[q.id],
                                                title: e.target.value,
                                              },
                                            }))
                                          }
                                          placeholder="Question Title"
                                        />
                                        <input
                                          type="text"
                                          value={editedQuestions[q.id]?.description || ""}
                                          onChange={(e) =>
                                            setEditedQuestions((prev) => ({
                                              ...prev,
                                              [q.id]: {
                                                ...prev[q.id],
                                                description: e.target.value,
                                              },
                                            }))
                                          }
                                          placeholder="Question Description"
                                        />
                                        <div className="question-actions">
                                          <button
                                            className="save-btn"
                                            onClick={() => {
                                              handleQuestionUpdate(q.id, {
                                                title: editedQuestions[q.id].title,
                                                description: editedQuestions[q.id].description,
                                              });
                                              setEditedQuestions((prev) => ({
                                                ...prev,
                                                [q.id]: { ...prev[q.id], isEditing: false },
                                              }));
                                            }}
                                          >
                                            Save
                                          </button>
                                          <button
                                            className="cancel-btn"
                                            onClick={() =>
                                              setEditedQuestions((prev) => ({
                                                ...prev,
                                                [q.id]: { ...prev[q.id], isEditing: false },
                                              }))
                                            }
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <p><strong>Title:</strong> {q.title}</p>
                                        <p><strong>Description:</strong> {q.description}</p>
                                        <div className="question-actions">
                                          <button
                                            className="edit-btn"
                                            onClick={() =>
                                              setEditedQuestions((prev) => ({
                                                ...prev,
                                                [q.id]: {
                                                  title: q.title,
                                                  description: q.description,
                                                  isEditing: true,
                                                },
                                              }))
                                            }
                                          >
                                            <FiEdit2 /> Edit
                                          </button>
                                          <button
                                            className="delete-btn"
                                            onClick={() => handleQuestionDelete(q.id, subtopic.id)}
                                          >
                                            <FiTrash2 /> Delete
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="no-questions">No questions available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Subtopics List */}
            <div className="all-subtopics">
              <h3>All Subtopics</h3>
              {subtopics && subtopics.length > 0 ? (
                <div className="subtopics-grid">
                  {subtopics.map((sub) => (
                    <div key={sub.id} className="subtopic-card">
                      <div className="card-content">
                        <p><strong>ID:</strong> {sub.id}</p>
                        <p><strong>Title:</strong> {sub.title}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          className="view-btn"
                          onClick={() => handleViewSubtopic(sub.id)}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-subtopics">No subtopics available</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageSubTopics;

