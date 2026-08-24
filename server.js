const express = require("express");

const app = express();

const PORT = 8082;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Temporary student data
let students = [
    {
        id: 1,
        name: "Rahul Kumar",
        email: "rahul@example.com",
        course: "BCA"
    },
    {
        id: 2,
        name: "Priya Sharma",
        email: "priya@example.com",
        course: "MCA"
    }
];

// Home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Get all students
app.get("/api/students", (req, res) => {
    res.json(students);
});

// Get student by ID
app.get("/api/students/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const student = students.find(student => student.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.json(student);
});

// Add student
app.post("/api/students", (req, res) => {
    const { name, email, course } = req.body;

    if (!name || !email || !course) {
        return res.status(400).json({
            message: "Name, email and course are required"
        });
    }

    const newStudent = {
        id: students.length > 0
            ? Math.max(...students.map(student => student.id)) + 1
            : 1,
        name,
        email,
        course
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});

// Delete student
app.delete("/api/students/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const studentIndex = students.findIndex(
        student => student.id === id
    );

    if (studentIndex === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const deletedStudent = students.splice(studentIndex, 1);

    res.json({
        message: "Student deleted successfully",
        student: deletedStudent[0]
    });
});

// Update student
app.put("/api/students/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const student = students.find(student => student.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, email, course } = req.body;

    if (name) student.name = name;
    if (email) student.email = email;
    if (course) student.course = course;

    res.json({
        message: "Student updated successfully",
        student
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});