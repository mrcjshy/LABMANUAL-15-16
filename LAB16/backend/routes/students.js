const express = require("express");
const db = require("../config/database");
const router = express.Router();

// Check if table exists
router.get("/check-table", (req, res) => {
    db.query("SHOW TABLES LIKE 'students'", (err, results) => {
        if (err) {
            console.error("Error checking table:", err);
            return res.status(500).json({ error: err.message });
        }
        
        const tableExists = results.length > 0;
        
        if (!tableExists) {
            // Create the table if it doesn't exist
            const createTableSQL = `
                CREATE TABLE students (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    course VARCHAR(100) NOT NULL
                )
            `;
            
            db.query(createTableSQL, (createErr) => {
                if (createErr) {
                    console.error("Error creating table:", createErr);
                    return res.status(500).json({ error: createErr.message });
                }
                
                res.json({ message: "Table created successfully" });
            });
        } else {
            res.json({ message: "Table already exists" });
        }
    });
});

// Get all students
router.get("/", (req, res) => {
    db.query("SELECT * FROM students", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a student
router.post("/", (req, res) => {
    const { name, course } = req.body;
    if (!name || !course) return res.status(400).json({ error: "Both fields are required" });

    const sql = "INSERT INTO students (name, course) VALUES (?, ?)";
    db.query(sql, [name, course], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, name, course });
    });
});

// Update a student
router.put("/:id", (req, res) => {
    const { name, course } = req.body;
    const sql = "UPDATE students SET name = ?, course = ? WHERE id = ?";
    db.query(sql, [name, course, req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ message: "Student updated" });
    });
});

// Delete a student
router.delete("/:id", (req, res) => {
    const sql = "DELETE FROM students WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ message: "Student deleted" });
    });
});

module.exports = router; 