import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentForm = ({ fetchStudents, editStudent, setEditStudent }) => {
    const [name, setName] = useState("");
    const [math, setMath] = useState("");
    const [science, setScience] = useState("");
    const [english, setEnglish] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Populate form when editing
    useEffect(() => {
        if (editStudent) {
            setName(editStudent.name);
            setMath(editStudent.math);
            setScience(editStudent.science);
            setEnglish(editStudent.english);
        }
    }, [editStudent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setIsSuccess(false);
        
        if (!name || math === "" || science === "" || english === "") {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        // Convert string values to numbers for validation and submission
        const mathScore = Number(math);
        const scienceScore = Number(science);
        const englishScore = Number(english);

        // Validate score ranges (0-100)
        if (isNaN(mathScore) || isNaN(scienceScore) || isNaN(englishScore)) {
            setError("All scores must be valid numbers.");
            setLoading(false);
            return;
        }
        
        if (mathScore < 0 || mathScore > 100 || scienceScore < 0 || scienceScore > 100 || englishScore < 0 || englishScore > 100) {
            setError("Scores must be between 0 and 100.");
            setLoading(false);
            return;
        }
        
        // Prepare data for submission
        const studentData = {
            name,
            math: mathScore,
            science: scienceScore,
            english: englishScore
        };
        
        console.log("Submitting data:", studentData);
        
        try {
            if (editStudent) {
                // Update existing student
                const response = await axios.put(
                    `/api/students/${editStudent.id}`, 
                    studentData
                );
                console.log("Update response:", response.data);
                setEditStudent(null);
            } else {
                // Add new student
                const response = await axios.post(
                    "/api/students", 
                    studentData
                );
                console.log("Add response:", response.data);
            }
            
            fetchStudents();
            resetForm();
            setIsSuccess(true);
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setIsSuccess(false);
            }, 3000);
        } catch (err) {
            console.error("Error details:", err);
            if (err.response) {
                console.error("Response data:", err.response.data);
                console.error("Response status:", err.response.status);
                setError(`Failed to ${editStudent ? 'update' : 'add'} student: ${err.response.data.error || err.message}`);
            } else {
                setError(`Failed to ${editStudent ? 'update' : 'add'} student: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setMath("");
        setScience("");
        setEnglish("");
        setError("");
        if (setEditStudent) setEditStudent(null);
    };

    return (
        <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
                <h3 className="card-title m-0">
                    {editStudent ? (
                        <span className="d-flex align-items-center">
                            <i className="bi bi-pencil-square me-2"></i>
                            Edit Student
                        </span>
                    ) : (
                        <span className="d-flex align-items-center">
                            <i className="bi bi-person-plus-fill me-2"></i>
                            Add New Student
                        </span>
                    )}
                </h3>
                {editStudent && (
                    <button 
                        type="button" 
                        className="btn btn-sm btn-outline-secondary" 
                        onClick={resetForm}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                )}
            </div>
            
            <div className="card-body">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                    </div>
                )}
                
                {isSuccess && (
                    <div className="alert alert-success" role="alert">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Student {editStudent ? 'updated' : 'added'} successfully!
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            <i className="bi bi-person me-2"></i>
                            Student Name
                        </label>
                        <input 
                            type="text" 
                            className="form-control"
                            id="name"
                            placeholder="Enter student name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="math" className="form-label">
                            <i className="bi bi-calculator me-2"></i>
                            Math Score
                        </label>
                        <input 
                            type="number" 
                            className="form-control"
                            id="math" 
                            placeholder="Enter math score (0-100)" 
                            value={math} 
                            onChange={(e) => setMath(e.target.value)}
                            min="0"
                            max="100" 
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="science" className="form-label">
                            <i className="bi bi-flask me-2"></i>
                            Science Score
                        </label>
                        <input 
                            type="number" 
                            className="form-control"
                            id="science" 
                            placeholder="Enter science score (0-100)" 
                            value={science} 
                            onChange={(e) => setScience(e.target.value)}
                            min="0"
                            max="100" 
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="english" className="form-label">
                            <i className="bi bi-book me-2"></i>
                            English Score
                        </label>
                        <input 
                            type="number" 
                            className="form-control"
                            id="english" 
                            placeholder="Enter english score (0-100)" 
                            value={english} 
                            onChange={(e) => setEnglish(e.target.value)}
                            min="0"
                            max="100" 
                        />
                    </div>
                    
                    <div className="d-grid">
                        <button 
                            type="submit" 
                            className={`btn ${editStudent ? 'btn-success' : 'btn-success'}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    {editStudent ? 'Updating...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <i className={`bi ${editStudent ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                                    {editStudent ? 'Update Student' : 'Add Student'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentForm; 