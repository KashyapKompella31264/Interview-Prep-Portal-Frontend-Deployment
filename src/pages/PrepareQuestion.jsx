import { useState, useEffect } from "react";
import InstructorNavbar from "../components/InstructorNavbar";
import { Box, Button, TextField, Typography, Container, Paper, Grid, FormControl, InputLabel, Select, MenuItem, Divider, IconButton, CircularProgress, Alert } from "@mui/material";
import { FiPlusCircle, FiTrash2, FiEdit, FiX } from "react-icons/fi";
import {v4 as uuidv4} from "uuid";
const PrepareQuestion = () => {
  const token = localStorage.getItem("token");

  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [category, setCategory] = useState("DATA STRUCTURES");
  const [testcases, setTestcases] = useState([
    { id:uuidv4(),input: "", output: "" },
    { id:uuidv4(),input: "", output: "" }
  ]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const fetchAllQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://interview-prep-portal-backend-application.onrender.com/instructors/questions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      setError("Error fetching questions");
    } finally {
      setLoading(false);
    }
  };

  const handleTestcaseChange = (index, field, value) => {
    const updatedTestcases = [...testcases];
    updatedTestcases[index][field] = value;
    setTestcases(updatedTestcases);
  };

  const addTestcase = () => {
    setTestcases([...testcases, { id:uuidv4(), input: "", output: "" }]);
  };

  const removeTestcase = (index) => {
    if (testcases.length <= 2) {
      setError("At least two test cases are required");
      return;
    }
    const updatedTestcases = testcases.filter((_, i) => i !== index);
    setTestcases(updatedTestcases);
  };

  const resetForm = () => {
    setQuestionTitle("");
    setQuestionDescription("");
    setDifficulty("Medium");
    setCategory("DATA STRUCTURES");
    setTestcases([{ input: "", output: "" }, { input: "", output: "" }]);
    setEditMode(false);
    setEditingQuestionId(null);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate test cases
    for (const tc of testcases) {
      if (!tc.input.trim() || !tc.expectedOutput.trim()) {
        setError("All test cases must have both input and output");
        return;
      }
    }

    const questionData = {
      title: questionTitle,
      description: questionDescription,
      difficulty,
      category,
      testcases,
    };

    try {
      const res = await fetch(
        editMode
          ? `https://interview-prep-portal-backend-application.onrender.com/instructors/question/${editingQuestionId}`
          : "https://interview-prep-portal-backend-application.onrender.com/instructors/questions",
        {
          method: editMode ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questionData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(`${editMode ? "Updated" : "Created"} question: ${data.title}`);
        resetForm();
        fetchAllQuestions();
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Error saving question");
    }
  };

  const handleEdit = (question) => {
    setEditMode(true);
    setEditingQuestionId(question.id);
    setQuestionTitle(question.title);
    setQuestionDescription(question.description);
    setDifficulty(question.difficulty);
    setCategory(question.category);
    setTestcases(question.testcases);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <InstructorNavbar />
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {editMode ? "Edit Question" : "Create New Question"}
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Question Title"
                  variant="outlined"
                  fullWidth
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={questionDescription}
                  onChange={(e) => setQuestionDescription(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={difficulty}
                    label="Difficulty"
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="DATA STRUCTURES">DATA STRUCTURES</MenuItem>
                    <MenuItem value="ALGORITHMS">ALGORITHMS</MenuItem>
                    <MenuItem value="DYNAMIC PROGRAMMING">DYNAMIC PROGRAMMING</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Test Cases
                </Typography>
                {testcases.map((tc, i) => (
                  <Paper key={uuidv4()} elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={5}>
                        <TextField
                          label={`Input #${i + 1}`}
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={2}
                          value={tc.input}
                          onChange={(e) => handleTestcaseChange(i, "input", e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <TextField
                          label={`Expected Output #${i + 1}`}
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={2}
                          value={tc.expectedOutput}
                          onChange={(e) => handleTestcaseChange(i, "expectedOutput", e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                        {testcases.length > 2 && (
                          <IconButton 
                            color="error" 
                            onClick={() => removeTestcase(i)}
                            aria-label="Delete test case"
                          >
                            <FiTrash2 />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
                <Button
                  startIcon={<FiPlusCircle />}
                  variant="outlined"
                  onClick={addTestcase}
                  sx={{ mt: 1 }}
                >
                  Add Test Case
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    size="large"
                  >
                    {editMode ? "Update Question" : "Create Question"}
                  </Button>
                  {editMode && (
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      onClick={resetForm}
                      size="large"
                      startIcon={<FiX />}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Question Bank</Typography>
          <Button 
            variant="contained" 
            onClick={fetchAllQuestions}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Refreshing..." : "Refresh Questions"}
          </Button>
        </Box>

        {loading && questions.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : questions.length === 0 ? (
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">No questions found</Typography>
            <Typography variant="body1">Create your first question above</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {questions.map((q) => (
              <Grid item xs={12} key={q.id}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" gutterBottom> 
                      ID: {q.id}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      {q.title}
                    </Typography>
                    <Button
                      startIcon={<FiEdit />}
                      variant="outlined"
                      onClick={() => handleEdit(q)}
                    >
                      Edit
                    </Button>
                  </Box>
                  
                  <Typography variant="body1" paragraph>
                    <strong>Description:</strong> {q.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Difficulty:</strong> {q.difficulty}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Category:</strong> {q.category}
                    </Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Test Cases
                  </Typography>
                  
                  {q.testcases && q.testcases.length > 0 ? (
                    <Grid container spacing={2}>
                      {q.testcases.map((tc, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="subtitle2">
                              Test Case #{index + 1}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Input:</strong>
                            </Typography>
                            <Box component="pre" sx={{ 
                              bgcolor: 'grey.100', 
                              p: 1, 
                              borderRadius: 1,
                              overflowX: 'auto',
                              whiteSpace: 'pre-wrap',
                              wordWrap: 'break-word'
                            }}>
                              {tc.input}
                            </Box>
                            <Typography variant="body2">
                              <strong>Expected Output:</strong>
                            </Typography>
                            <Box component="pre" sx={{ 
                              bgcolor: 'grey.100', 
                              p: 1, 
                              borderRadius: 1,
                              overflowX: 'auto',
                              whiteSpace: 'pre-wrap',
                              wordWrap: 'break-word'
                            }}>
                              {tc.expectedOutput}
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No test cases available.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default PrepareQuestion;