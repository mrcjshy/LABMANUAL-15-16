const mysql = require("mysql");

// Direct database connection without environment variables
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_db"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.message);
        return;
    }
    console.log("✅ MySQL Connected...");
});

module.exports = db; 