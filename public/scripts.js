// Toggle visibility based on role selection
function selectRole(role) {
  document.getElementById('roleSelection').classList.add('hidden');
  document.getElementById('studentSection').classList.add('hidden');
  document.getElementById('teacherSection').classList.add('hidden');

  if (role === 'student') {
    document.getElementById('studentSection').classList.remove('hidden');
  } else if (role === 'teacher') {
    document.getElementById('teacherSection').classList.remove('hidden');
  }
}

// Show loading indicator with optional message
function showLoading(message = "Loading...") {
  const messageArea = document.getElementById('messageArea');
  const spinner = document.getElementById('spinner');
  const messageText = document.getElementById('messageText');
  messageArea.classList.remove('hidden');
  spinner.classList.remove('hidden');
  messageText.innerText = message;
}

// Hide loading indicator
function hideLoading() {
  const messageArea = document.getElementById('messageArea');
  const spinner = document.getElementById('spinner');
  const messageText = document.getElementById('messageText');
  spinner.classList.add('hidden');
  messageText.innerText = '';
  // Optionally hide the message area if no message is present
  if (!messageText.innerText.trim()) {
    messageArea.classList.add('hidden');
  }
}

// Display a message to the user
async function displayMessage(message) {
  const messageArea = document.getElementById('messageArea');
  const spinner = document.getElementById('spinner');
  const messageText = document.getElementById('messageText');
  spinner.classList.add('hidden'); // Ensure spinner is hidden
  messageText.innerText = message;
  messageArea.classList.remove('hidden');
}

// Utility function to handle fetch responses
async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Unknown error occurred');
  }
  // Attempt to parse JSON, fallback if no content
  try {
    return await response.json();
  } catch (e) {
    return { message: 'Operation completed successfully.' };
  }
}

// Student CRUD functions
async function createStudent() {
  showLoading("Creating student...");
  const student = {
    id: prompt("Enter Student ID"),
    firstName: prompt("Enter First Name"),
    lastName: prompt("Enter Last Name"),
    email: prompt("Enter Email"),
    dateOfBirth: prompt("Enter Date of Birth (YYYY-MM-DD)"),
    enrollmentDate: prompt("Enter Enrollment Date (YYYY-MM-DD)"),
    courses: prompt("Enter Courses (comma-separated)").split(",").map(course => course.trim()),
    grades: { course1: 'A', course2: 'B' }, // Consider making this dynamic
    contactNumber: prompt("Enter Contact Number"),
    address: {
      street: prompt("Enter Street"),
      city: prompt("Enter City"),
      state: prompt("Enter State"),
      zip: prompt("Enter Zip")
    }
  };

  try {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    const result = await handleResponse(response);
    await displayMessage(`Student created: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    await displayMessage(`Error creating student: ${error.message}`);
  }
}

async function readStudent() {
  const id = prompt("Enter Student ID");
  if (!id) {
    await displayMessage("Student ID is required.");
    return;
  }

  showLoading("Fetching student details...");
  try {
    const response = await fetch(`/api/students/${id}`);
    const result = await handleResponse(response);
    await displayMessage(`Student details: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    await displayMessage(`Error reading student: ${error.message}`);
  }
}

async function updateStudent() {
  const id = prompt("Enter Student ID");
  if (!id) {
    await displayMessage("Student ID is required.");
    return;
  }

  // Prompt the user for the fields they want to update
  const fieldsToUpdate = prompt("Which fields do you want to update? (firstName, lastName, email, dateOfBirth, enrollmentDate, courses, contactNumber, address)").split(",");

  const updatedInfo = {}; // Start with an empty object

  // Loop through the fields and prompt for values
  for (const field of fieldsToUpdate) {
    const trimmedField = field.trim(); // Remove any extra spaces
    let value;

    switch (trimmedField) {
      case 'firstName':
        value = prompt("Enter First Name");
        break;
      case 'lastName':
        value = prompt("Enter Last Name");
        break;
      case 'email':
        value = prompt("Enter Student Email to update");
        break;
      case 'dateOfBirth':
        value = prompt("Enter Date of Birth (YYYY-MM-DD)");
        break;
      case 'enrollmentDate':
        value = prompt("Enter Enrollment Date (YYYY-MM-DD)");
        break;
      case 'courses':
        value = prompt("Enter Courses (comma-separated)").split(",").map(course => course.trim());
        break;
      case 'contactNumber':
        value = prompt("Enter Contact Number");
        break;
      case 'address':
        // Prompt for each part of the address
        const street = prompt("Enter Street");
        const city = prompt("Enter City");
        const state = prompt("Enter State");
        const zip = prompt("Enter Zip");
        value = { street, city, state, zip };
        break;
      default:
        console.warn(`Unknown field: ${trimmedField}`);
        continue; // Skip unknown fields
    }

    if (value !== null) { // Ensure the user didn't cancel the prompt
      updatedInfo[trimmedField] = value;
    }
  }

  if (Object.keys(updatedInfo).length === 0) {
    await displayMessage("No valid fields to update.");
    return;
  }

  showLoading("Updating student...");
  try {
    const response = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedInfo)
    });
    const result = await handleResponse(response);
    await displayMessage(`Student updated: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    await displayMessage(`Error updating student: ${error.message}`);
  }
}

async function deleteStudent() {
  const id = prompt("Enter Student ID to delete");
  if (!id) {
    await displayMessage("Student ID is required.");
    return;
  }

  const confirmation = confirm(`Are you sure you want to delete student with ID: ${id}?`);
  if (!confirmation) {
    await displayMessage("Delete operation canceled.");
    return;
  }

  showLoading("Deleting student...");
  try {
    const response = await fetch(`/api/students/${id}`, {
      method: 'DELETE'
    });
    const result = await handleResponse(response);
    await displayMessage(`Student deleted: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    await displayMessage(`Error deleting student: ${error.message}`);
  }
}

async function listStudents() {
  showLoading("Fetching list of students...");
  try {
    const response = await fetch('/api/students');
    const result = await handleResponse(response);
    await displayMessage(`Students list:\n${JSON.stringify(result, null, 2)}`);

  } catch (error) {
    await displayMessage(`Error listing students: ${error.message}`);
  }
}

// Teacher CRUD functions
async function createTeacher() {
  showLoading("Creating teacher...");
  const teacher = {
    id: prompt("Enter Teacher ID"),
    firstName: prompt("Enter First Name"),
    lastName: prompt("Enter Last Name"),
    email: prompt("Enter Email"),
    hireDate: prompt("Enter Hire Date (YYYY-MM-DD)"),
    subjects: prompt("Enter Subjects (comma-separated)").split(",").map(subject => subject.trim()),
    contactNumber: prompt("Enter Contact Number"),
    officeLocation: prompt("Enter Office Location"),
    bio: prompt("Enter Bio")
  };

  try {
    const response = await fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacher)
    });
    const result = await handleResponse(response);
    await displayMessage(`Teacher created: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    await displayMessage(`Error creating teacher: ${error.message}`);
  }
}

async function readTeacher() {
  const id = prompt("Enter Teacher ID");
  if (!id) {
    await displayMessage("Teacher ID is required.");
    return;
  }

  showLoading("Fetching teacher details...");
  try {
    const response = await fetch(`/api/teachers/${id}`);
    const result = await handleResponse(response);
    await displayMessage(`Teacher details: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    await displayMessage(`Error reading teacher: ${error.message}`);
  }
}

async function updateTeacher() {
  const id = prompt("Enter Teacher ID");
  if (!id) {
    await displayMessage("Teacher ID is required.");
    return;
  }

  // Prompt the user for the fields they want to update
  const fieldsToUpdate = prompt("Which fields do you want to update? (firstName, lastName, email, hireDate, subjects, contactNumber, officeLocation, bio)").split(",");

  const updatedInfo = {}; // Start with an empty object

  // Loop through the fields and prompt for values
  for (const field of fieldsToUpdate) {
    const trimmedField = field.trim(); // Remove any extra spaces
    let value;

    switch (trimmedField) {
      case 'firstName':
        value = prompt("Enter New First Name");
        break;
      case 'lastName':
        value = prompt("Enter New Last Name");
        break;
      case 'email':
        value = prompt("Enter New Email");
        break;
      case 'hireDate':
        value = prompt("Enter New Hire Date (YYYY-MM-DD)");
        break;
      case 'subjects':
        value = prompt("Enter New Subjects (comma-separated)").split(",").map(subject => subject.trim());
        break;
      case 'contactNumber':
        value = prompt("Enter New Contact Number");
        break;
      case 'officeLocation':
        value = prompt("Enter New Office Location");
        break;
      case 'bio':
        value = prompt("Enter New Bio");
        break;
      default:
        console.warn(`Unknown field: ${trimmedField}`);
        continue; // Skip unknown fields
    }

    if (value !== null) { // Ensure the user didn't cancel the prompt
      updatedInfo[trimmedField] = value;
    }
  }

  if (Object.keys(updatedInfo).length === 0) {
    await displayMessage("No valid fields to update.");
    return;
  }

  showLoading("Updating teacher...");
  try {
    const response = await fetch(`/api/teachers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedInfo)
    });
    const result = await handleResponse(response);
    await displayMessage(`Teacher updated: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    await displayMessage(`Error updating teacher: ${error.message}`);
  }
}

async function deleteTeacher() {
  const id = prompt("Enter Teacher ID to delete");
  if (!id) {
    await displayMessage("Teacher ID is required.");
    return;
  }

  const confirmation = confirm(`Are you sure you want to delete teacher with ID: ${id}?`);
  if (!confirmation) {
    await displayMessage("Delete operation canceled.");
    return;
  }

  showLoading("Deleting teacher...");
  try {
    const response = await fetch(`/api/teachers/${id}`, {
      method: 'DELETE'
    });
    const result = await handleResponse(response);
    await displayMessage(`Teacher deleted: ${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    await displayMessage(`Error deleting teacher: ${error.message}`);
  }
}

async function listTeachers() {
  showLoading("Fetching list of teachers...");
  try {
    const response = await fetch('/api/teachers');
    const result = await handleResponse(response);
    await displayMessage(`Teachers list:\n${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    await displayMessage(`Error listing teachers: ${error.message}`);
  }
}
