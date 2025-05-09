import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDOM from 'react-dom';

const StudentList = ({ students, fetchStudents, setEditStudent }) => {
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    
    // Close modal if Escape key is pressed
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && showConfirmModal) {
                cancelDelete();
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        
        // Prevent scrolling when modal is open
        if (showConfirmModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [showConfirmModal]);
    
    const handleEdit = (student) => {
        setEditStudent(student);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prepareDelete = (student) => {
        setStudentToDelete(student);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!studentToDelete) return;
        
        try {
            setLoading(true);
            setDeleteId(studentToDelete.id);
            await axios.delete(`http://localhost:5000/api/students/${studentToDelete.id}`);
            fetchStudents();
            setShowConfirmModal(false);
            setStudentToDelete(null);
        } catch (error) {
            console.error("Error deleting student:", error);
            alert(`Failed to delete student: ${error.message}`);
        } finally {
            setLoading(false);
            setDeleteId(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setStudentToDelete(null);
    };

    if (students.length === 0) {
        return (
            <div className="card h-100">
                <div className="card-body text-center py-5">
                    <div className="mb-4">
                        <i className="bi bi-mortarboard text-muted" style={{ fontSize: '3.5rem' }}></i>
                    </div>
                    <h4 className="mb-3">No Students Found</h4>
                    <p className="text-muted mb-4">Start by adding a new student record</p>
                    <div className="text-center">
                        <button 
                            className="btn btn-outline-success" 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            Add Student
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Delete confirmation modal
    const DeleteConfirmModal = () => {
        return ReactDOM.createPortal(
            <div 
                className="modal-backdrop" 
                style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 1050,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onClick={cancelDelete}
            >
                <div 
                    className="modal-dialog modal-dialog-centered" 
                    style={{ margin: 0, maxWidth: '500px', width: '90%' }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="card">
                        <div className="card-header bg-danger text-white">
                            <h5 className="modal-title m-0 d-flex align-items-center justify-content-between">
                                <span>
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Confirm Deletion
                                </span>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={cancelDelete}
                                    aria-label="Close"
                                ></button>
                            </h5>
                        </div>
                        <div className="card-body">
                            <p>Are you sure you want to delete student <strong>{studentToDelete?.name}</strong>?</p>
                            <p className="text-muted small">This action cannot be undone.</p>
                        </div>
                        <div className="card-footer d-flex justify-content-end">
                            <button 
                                className="btn btn-outline-secondary me-2" 
                                onClick={cancelDelete}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-danger" 
                                onClick={confirmDelete}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return (
        <>
            {showConfirmModal && <DeleteConfirmModal />}
            
            <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <h3 className="card-title m-0">
                        <span className="d-flex align-items-center">
                            Student Records
                        </span>
                    </h3>
                    <span className="badge bg-success">{students.length} Students</span>
                </div>
                
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th scope="col" width="5%">#</th>
                                <th scope="col" width="40%">NAME</th>
                                <th scope="col" width="35%">COURSE</th>
                                <th scope="col" width="20%" className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student.id} style={{"--row-index": index}}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={`${process.env.PUBLIC_URL}/fighting duck.png`} 
                                                alt="Fighting Duck" 
                                                className="me-2"
                                                style={{ height: '30px', width: 'auto' }}
                                            />
                                            <span className="fw-medium">{student.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge bg-light text-dark">
                                            {student.course}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <div className="btn-group" role="group">
                                            <button 
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() => handleEdit(student)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => prepareDelete(student)}
                                                disabled={loading && deleteId === student.id}
                                            >
                                                {loading && deleteId === student.id ? (
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    <i className="bi bi-trash"></i>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default StudentList; 