import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Configure axios with default settings
axios.defaults.baseURL = "http://localhost:5000";

// Add request/response interceptors for debugging
axios.interceptors.request.use(request => {
    console.log('API Request:', {
        url: request.url,
        method: request.method,
        data: request.data
    });
    return request;
});

axios.interceptors.response.use(
    response => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    error => {
        console.error('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

const App = () => {
    // Add the bootstrap icons CDN to the document head
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css';
        document.head.appendChild(link);

        // Add Google Font - Inter
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
        document.head.appendChild(fontLink);
        
        return () => {
            document.head.removeChild(link);
            document.head.removeChild(fontLink);
        };
    }, []);

    const [students, setStudents] = useState([]);
    const [editStudent, setEditStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/students");
            setStudents(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching students:", error);
            setError("Failed to load students. Please check if the server is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check if the table exists and create it if needed
        const setupDatabase = async () => {
            try {
                await axios.get("/api/students/check-table");
                fetchStudents();
            } catch (error) {
                console.error("Database setup error:", error);
                setError("Failed to connect to the database. Please check your server configuration.");
                setLoading(false);
            }
        };
        
        setupDatabase();
    }, []);

    return (
        <div className="app-container">
            <header className="py-5 mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto text-center">
                            <div className="app-logo mb-3">
                                <img 
                                    src={`${process.env.PUBLIC_URL}/ptc logo.png`} 
                                    alt="PTC Logo" 
                                    className="ptc-logo"
                                />
                            </div>
                            <h1 className="display-4 fw-bold mb-3">
                                <span className="text-success">PTC</span> Student Management System
                            </h1>
                            <p className="lead col-lg-10 mx-auto">
                                Pateros Technological College - Built by Dev Josh
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container pb-5">
                {error && (
                    <div className="alert alert-danger mb-4" role="alert">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
                            <div>
                                <strong>Connection Error</strong>
                                <p className="mb-0">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row g-4">
                    <div className="col-lg-4">
                        <StudentForm 
                            fetchStudents={fetchStudents} 
                            editStudent={editStudent} 
                            setEditStudent={setEditStudent} 
                        />
                    </div>
                    
                    <div className="col-lg-8">
                        {loading ? (
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
                                    <div className="spinner-border text-success mb-4" style={{width: "3rem", height: "3rem"}} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <h5 className="text-muted mb-3">Loading Student Records</h5>
                                    <p className="text-muted">Please wait while we fetch the data...</p>
                                </div>
                            </div>
                        ) : (
                            <StudentList 
                                students={students} 
                                fetchStudents={fetchStudents} 
                                setEditStudent={setEditStudent} 
                            />
                        )}
                    </div>
                </div>
            </main>
            
            <footer className="mt-auto py-4 text-center">
                <div className="container">
                    <div className="border-top pt-4">
                        <p className="mb-0">
                            <span className="text-success fw-bold">PTC</span> Student Management System &copy; {new Date().getFullYear()}
                        </p>
                        <p className="small text-muted">
                            Pateros Technological College
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
