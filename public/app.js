let students = [];

const studentForm = document.getElementById("studentForm");

const studentTable = document.getElementById("studentTable");

const searchInput = document.getElementById("search");

const totalStudents = document.getElementById("totalStudents");

const totalCourses = document.getElementById("totalCourses");


// Load students

async function loadStudents() {

    try {

        const response = await fetch("/api/students");

        students = await response.json();

        displayStudents(students);

        updateDashboard();

    } catch (error) {

        console.error("Error loading students:", error);

    }
}


// Display students

function displayStudents(data) {

    studentTable.innerHTML = "";

    if (data.length === 0) {

        studentTable.innerHTML = `
            <tr>
                <td colspan="5">
                    No students found
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${student.id}</td>

            <td>${student.name}</td>

            <td>${student.email}</td>

            <td>${student.course}</td>

            <td>

                <button
                    class="btn-delete"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            </td>

        `;

        studentTable.appendChild(row);

    });

}


// Add student

studentForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const course =
        document.getElementById("course").value;


    try {

        const response = await fetch(
            "/api/students",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    course
                })
            }
        );


        if (!response.ok) {

            const error = await response.json();

            alert(error.message);

            return;
        }


        studentForm.reset();

        await loadStudents();

        alert("Student added successfully!");

    } catch (error) {

        console.error(error);

        alert("Unable to add student.");

    }

});


// Delete student

async function deleteStudent(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this student?");


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `/api/students/${id}`,
            {
                method: "DELETE"
            }
        );


        const result = await response.json();


        if (!response.ok) {

            alert(result.message);

            return;
        }


        await loadStudents();

        alert("Student deleted successfully!");

    } catch (error) {

        console.error(error);

        alert("Unable to delete student.");

    }

}


// Search

searchInput.addEventListener("input", function() {

    const searchValue =
        searchInput.value.toLowerCase();


    const filteredStudents =
        students.filter(student =>

            student.name
                .toLowerCase()
                .includes(searchValue)

            ||

            student.email
                .toLowerCase()
                .includes(searchValue)

            ||

            student.course
                .toLowerCase()
                .includes(searchValue)

        );


    displayStudents(filteredStudents);

});


// Dashboard

function updateDashboard() {

    totalStudents.textContent =
        students.length;


    const courses =
        new Set(
            students.map(student => student.course)
        );


    totalCourses.textContent =
        courses.size;

}


// Start application

loadStudents();