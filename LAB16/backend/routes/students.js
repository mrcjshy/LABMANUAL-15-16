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
                    math INT NOT NULL,
                    science INT NOT NULL,
                    english INT NOT NULL,
                    average FLOAT,
                    grade CHAR(1)
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
        if (err) {
            console.error("Error fetching students:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Add a student
router.post("/", (req, res) => {
    console.log("Received add student request with body:", req.body);
    const { name, math, science, english } = req.body;
    
    // Improved validation
    const isValid = name && name.trim() !== '' && 
                   math !== undefined && math !== null && math !== '' &&
                   science !== undefined && science !== null && science !== '' &&
                   english !== undefined && english !== null && english !== '';
    
    if (!isValid) {
        console.log("Validation failed with values:", { name, math, science, english });
        return res.status(400).json({ error: "All fields (name, math, science, english) are required." });
    }
    
    // Convert to numbers to ensure proper calculation
    const mathScore = Number(math);
    const scienceScore = Number(science);
    const englishScore = Number(english);

    // Additional number validation
    if (isNaN(mathScore) || isNaN(scienceScore) || isNaN(englishScore)) {
        console.log("Invalid number values:", { mathScore, scienceScore, englishScore });
        return res.status(400).json({ error: "Math, science, and english scores must be valid numbers." });
    }

    // Calculate average and grade
    const average = parseFloat(((mathScore + scienceScore + englishScore) / 3).toFixed(2));
    
    const grade = average >= 90 ? "A" :
                  average >= 80 ? "B" :
                  average >= 70 ? "C" : "D";

    console.log("Calculated values:", { 
        mathScore, 
        scienceScore, 
        englishScore, 
        average, 
        grade 
    });

    const sql = "INSERT INTO students (name, math, science, english, average, grade) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, mathScore, scienceScore, englishScore, average, grade], (err, result) => {
        if (err) {
            console.error("Error adding student:", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("Student added successfully with ID:", result.insertId);
        res.status(200).json({ 
            id: result.insertId, 
            name, 
            math: mathScore, 
            science: scienceScore, 
            english: englishScore, 
            average, 
            grade 
        });
    });
});

// Update a student
router.put("/:id", (req, res) => {
    console.log("Received update student request for ID:", req.params.id, "with body:", req.body);
    const { name, math, science, english } = req.body;
    
    // Improved validation
    const isValid = name && name.trim() !== '' && 
                   math !== undefined && math !== null && math !== '' &&
                   science !== undefined && science !== null && science !== '' &&
                   english !== undefined && english !== null && english !== '';
    
    if (!isValid) {
        console.log("Validation failed with values:", { name, math, science, english });
        return res.status(400).json({ error: "All fields (name, math, science, english) are required." });
    }

    // Convert to numbers
    const mathScore = Number(math);
    const scienceScore = Number(science);
    const englishScore = Number(english);

    // Additional number validation
    if (isNaN(mathScore) || isNaN(scienceScore) || isNaN(englishScore)) {
        console.log("Invalid number values:", { mathScore, scienceScore, englishScore });
        return res.status(400).json({ error: "Math, science, and english scores must be valid numbers." });
    }

    // Calculate average and grade
    const average = parseFloat(((mathScore + scienceScore + englishScore) / 3).toFixed(2));
    
    const grade = average >= 90 ? "A" :
                  average >= 80 ? "B" :
                  average >= 70 ? "C" : "D";

    const sql = "UPDATE students SET name = ?, math = ?, science = ?, english = ?, average = ?, grade = ? WHERE id = ?";
    db.query(sql, [name, mathScore, scienceScore, englishScore, average, grade, req.params.id], (err, result) => {
        if (err) {
            console.error("Error updating student:", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("Student updated successfully");
        res.json({ message: "Student updated successfully" });
    });
});

// Delete a student
router.delete("/:id", (req, res) => {
    console.log("Received delete student request for ID:", req.params.id);
    const sql = "DELETE FROM students WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error deleting student:", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("Student deleted successfully");
        res.json({ message: "Student deleted successfully" });
    });
});

module.exports = router; 