import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentForm = ({ fetchStudents, editStudent, setEditStudent }) => {
    const [name, setName] = useState("");
    const [course, setCourse] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Populate form when editing
    useEffect(() => {
        if (editStudent) {
            setName(editStudent.name);
            setCourse(editStudent.course);
        }
    }, [editStudent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setIsSuccess(false);
        
        if (!name || !course) {
            setError("Both fields are required.");
            setLoading(false);
            return;
        }
        
        try {
            if (editStudent) {
                // Update existing student
                await axios.put(`http://localhost:5000/api/students/${editStudent.id}`, { name, course });
                setEditStudent(null);
            } else {
                // Add new student
                await axios.post("http://localhost:5000/api/students", { name, course });
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
            setError(`Failed to ${editStudent ? 'update' : 'add'} student: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setCourse("");
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
                    <div className="mb-4">
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
                    
                    <div className="mb-4">
                        <label htmlFor="course" className="form-label">
                            <i className="bi bi-book me-2"></i>
                            Course
                        </label>
                        <input 
                            type="text" 
                            className="form-control"
                            id="course" 
                            placeholder="Enter course name" 
                            value={course} 
                            onChange={(e) => setCourse(e.target.value)} 
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