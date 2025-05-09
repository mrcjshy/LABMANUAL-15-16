const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const studentRoutes = require("./routes/students");

const app = express();

// Configure CORS with specific options
app.use(cors({
    origin: 'http://localhost:3000', // React app's address
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Test route to check if server is working
app.get("/", (req, res) => {
    res.send("Student Management API is running");
});

app.use("/api/students", studentRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); 