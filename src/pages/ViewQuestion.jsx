import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

import StudentNavbar from '../components/StudentNavbar';
import axios from "axios";
import { 
    FiAlertTriangle, 
    FiClock, 
    FiCode, 
    FiCpu, 
    FiLoader, 
    FiTerminal,
    FiCheckCircle,
    FiXCircle
} from "react-icons/fi";

const ViewQuestion = () => {
    const { questionId } = useParams();
    const [question, setQuestion] = useState(null);
    const [error, setError] = useState("");
    const [language, setLanguage] = useState("java");
    const [code, setCode] = useState(`public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Welcome to Kashyap's Code Editor");\n    }\n}`);
    const [input, setInput] = useState(""); 
    const [executionStats, setExecutionStats] = useState("");
    const [testResults, setTestResults] = useState([]);
    useEffect(()=>{
        if(executionStats){
            console.log("Exectution stats updated are: ",executionStats);
        }
    },[executionStats]);
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authorization required. Please log in.");
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
                setQuestion(data);
            } catch (error) {
                console.error("Error fetching question:", error);
                setError("Could not fetch the question.");
            }
        };
        fetchQuestion();
    }, [questionId]);

    const handleRunCode = async () => {
        setTestResults([]);
        setExecutionStats("");
        try {
            const token = localStorage.getItem("token");
            if (!token) return setError("Authorization required. Please log in.");

            const response = await axios.post(
                "https://interview-prep-portal-backend-application.onrender.com/api/execute",
                { code, language, questionId, input },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("response of handleruncode function is: ",response.data);
            const { executionTime, compileTime, results } = response.data;
            setTestResults(results || []);
            console.log("the results are: ",results);
            let statsMessage = "";
            if (compileTime) statsMessage += `⏱️ Compile Time: ${compileTime}\n`;
            if (executionTime) statsMessage += `⚡ Execution Time: ${executionTime}\n`;
            setExecutionStats(statsMessage);
            console.log(executionStats);
        } catch (error) {
            console.error("Error executing code:", error);
            setTestResults([{ status: "ERROR", output: "Execution failed" }]);
        }
    };

    return (
        <div className="view-question-container">
            <StudentNavbar/>
            <main className="question-main-content">
                <div className="question-header">
                    <h1 className="question-title">
                        {question?.title || 'Coding Problem'}
                        <span className="title-underline" />
                    </h1>
                    {error && (
                        <div className="error-message">
                            <FiAlertTriangle className="error-icon" />
                            {error}
                        </div>
                    )}
                </div>

                {question ? (
                    <div className="question-content-grid">
                        {/* Left Column */}
                        <div className="left-column">
                            <div className="problem-description-card">
                                <div className="metadata-row">
                                    <span className={`difficulty-tag ${question.difficulty.toLowerCase()}`}>
                                        {question.difficulty}
                                    </span>
                                    <span className="category-badge">
                                        {question.category}
                                    </span>
                                </div>
                                <h2 className="section-title">Problem Description</h2>
                                <pre className="description-text">{question.description}</pre>
                            </div>

                            <div className="editor-section">
                                <div className="editor-header">
                                    <h3 className="section-title">
                                        <FiCode className="section-icon" />
                                        Code Editor
                                    </h3>
                                    <select 
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="language-dropdown"
                                    >
                                        <option value="java">Java</option>
                                        <option value="python">Python</option>
                                        <option value="cpp">C++</option>
                                    </select>
                                </div>
                                <Editor
                                    height="500px"
                                    theme="vs-dark"
                                    language={language}
                                    value={code}
                                    onChange={(value) => setCode(value || "")}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="right-column">
                            <div className="io-section">
                                
                                <button onClick={handleRunCode} className="run-button">
                                        <FiCpu className="button-icon" />
                                        Run Code
                                    </button>
                                {executionStats && (
                                    <div className="execution-stats">
                                        <h3 className="section-title">
                                            <FiClock className="section-icon" />
                                            Execution Stats
                                        </h3>
                                        {console.log("exection stats are: ",executionStats)}
                                        <pre>{executionStats}</pre>
                                    </div>
                                )}

                                {testResults.length > 0 && (
                                    <div className="test-results">
                                        <h3 className="section-title">
                                            <FiCheckCircle className="section-icon" />
                                            Test Results
                                        </h3>
                                        {console.log("the errors are: ",testResults.error)}
                                        <div className="test-cases-grid">
                                            {testResults.map((result, index) => (
                                                <div key={index} className={`test-case-box ${result.status === 'PASSED' ? 'passed' : 'failed'}`}>                                            
                                                    <div className="test-case-header">
                                                        <span>Test Case #{index + 1}</span>
                                                        {result.status === 'PASSED' ? (
                                                            <FiCheckCircle className="passed-icon" />
                                                        ) : (
                                                            <FiXCircle className="failed-icon" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        {console.log("the result is: ",result)}
                                                        
                                                        <span><strong>Status:{result.status}</strong></span>
                                                        {result.status==='PASSED'?(
                                                            <FiCheckCircle className="passed-icon"/>
                                                        ):(
                                                            <FiCheckCircle className="failed-icon"/>
                                                        )}
                                                    </div>
                                                    <div className="test-case-details">
                                                        <div className="test-case-row">
                                                            <span>Input:</span>
                                                            <pre>{result.input}</pre>
                                                        </div>
                                                        <div className="test-case-row">
                                                            <span>Expected:</span>
                                                            <pre>{result.expectedOutput}</pre>
                                                        </div>
                                                        <div className="test-case-row">
                                                            <span>Actual:</span>
                                                            <pre>{result.output}</pre>
                                                        </div>
                                                        {result.error && (
        <div className="test-case-row">
            <span>Error:</span>
            <pre>{result.error}</pre>
        </div>
    )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="loading-container">
                        <FiLoader className="loading-spinner" />
                        Loading question...
                    </div>
                )}
            </main>
        </div>
    );
};

export default ViewQuestion;
