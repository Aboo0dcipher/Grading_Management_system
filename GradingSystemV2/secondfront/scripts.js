  const API_BASE_URL = 'http://localhost:5500';
  let selectedCourseId = '';
  let selectedComponent = '';
  let studentsList = [];




  document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const loginError = document.getElementById('login-error');
    loginError.innerText = '';

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', role);
        document.getElementById('login-section').style.display = 'none';

        if (role === 'faculty') {
          showFacultyDashboard();
        } else {
          showStudentDashboard();
        }
      } else {
        loginError.innerText = data.message || 'Invalid credentials';
      }
    } catch (err) {
      loginError.innerText = 'Failed to connect to the server';
    }
  });






  async function showFacultyDashboard() {
    document.getElementById('faculty-dashboard').style.display = 'block';
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/faculty/courses`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const courses = await response.json();
    const coursesDiv = document.getElementById('assigned-courses');
    coursesDiv.innerHTML = '';

    if (courses.length === 0) {
      coursesDiv.innerHTML = '<p>No courses assigned</p>';
    } else {
      courses.forEach(course => {
        const div = document.createElement('div');
        div.innerHTML = `
          <h3>${course.name} (Credits: ${course.credit})</h3>
          ${getCAButtons(course)}
        `;
        coursesDiv.appendChild(div);
      });
    }
  }






  function getCAButtons(course) {
    let buttons = '';
    buttons += `<button onclick="enterMarks('${course._id}', 'CA1', '${course.name}')">Enter CA1 Marks</button>`;
    if (course.credit >= 2) {
      buttons += `<button onclick="enterMarks('${course._id}', 'CA2', '${course.name}')">Enter CA2 Marks</button>`;
    }
    if (course.credit >= 3) {
      buttons += `<button onclick="enterMarks('${course._id}', 'CA3', '${course.name}')">Enter CA3 Marks</button>`;
    }
    if (course.credit === 4) {
      buttons += `<button onclick="enterMarks('${course._id}', 'CA4', '${course.name}')">Enter CA4 Marks</button>`;
    }
    buttons += `<button onclick="enterMarks('${course._id}', 'ESE', '${course.name}')">Enter ESE Marks</button>`;
    return buttons;
  }




  async function enterMarks(courseId, component, courseName) {
    selectedCourseId = courseId;
    selectedComponent = component;
    document.getElementById('component-name').innerText = component;
    document.getElementById('course-name').innerText = courseName;
    document.getElementById('marks-entry-section').style.display = 'block';
  
    const token = localStorage.getItem('token');
  
    // Fetch all students enrolled in the course
    const studentsResponse = await fetch(`${API_BASE_URL}/api/faculty/students?courseId=${courseId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  
    studentsList = await studentsResponse.json(); // Update global studentsList
    console.log("All students:", studentsList); // Log to ensure students are fetched
  
    // Fetch marks for the specified component of the course
    const marksResponse = await fetch(`${API_BASE_URL}/api/faculty/marks?courseId=${courseId}&component=${component}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  
    const marksData = await marksResponse.json();
    console.log("Marks data:", marksData); // Log to ensure marks are fetched
  
    // Map marks data by studentId for easy lookup
    const marksMap = new Map();
    marksData.forEach(markEntry => {
      marksMap.set(markEntry.studentId, markEntry.marks);
    });
  
    const tbody = document.querySelector('#marks-table tbody');
    tbody.innerHTML = '';  // Clear previous entries
  
    // Combine the data: Iterate over all students and display their marks if available
    if (studentsList.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No students enrolled in this course</td></tr>';
    } else {
      studentsList.forEach(student => {
        // const mark = marksMap.get(student._id) || '';  
        const mark = marksMap.has(student._id) ? marksMap.get(student._id) : 'No marks entered';

       
  
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.PRN}</td>
         <td>${mark === 0 ? '0' : mark}</td> <!-- Show 0 instead of 'No marks entered' -->
         <td><input type="number" min="0" max="100" id="mark-${student._id}" value="${mark === 'No marks entered' ? '' : mark}" placeholder="Enter Marks"></td>
         <td><button onclick="updateMark('${student._id}')">Update</button></td>
        `;
        tbody.appendChild(row);
      });
    }
  }

  




  async function submitMarks() {
    const token = localStorage.getItem('token');
    const marksData = [];
    let isValid = true;
  
    console.log('Submitting marks for students:', studentsList); // Log the students list to check if it’s being populated
  
    // Iterate through each student to collect marks data.
    studentsList.forEach(student => {
      const markInput = document.getElementById(`mark-${student._id}`); // Use _id instead of studentId
      if (markInput) {
        const mark = markInput.value;
        console.log(`Student ID: ${student._id}, Mark: ${mark}`); // Log each mark input.
        
        if (mark !== '') {
          const numericMark = Number(mark);
          
          // Check if the mark is within the valid range.
          if (numericMark < 0 || numericMark > 100) {
            alert(`Marks for ${student.name} must be between 0 and 100.`);
            isValid = false;
            return;
          }
  
          // Add the valid mark data to marksData array.
          marksData.push({
            studentId: student._id,  // Changed this to student._id to match your data
            courseId: selectedCourseId,
            component: selectedComponent,
            marks: numericMark,
          });
        } else {
          console.log(`No valid marks entered for student ID: ${student._id}`);
        }
      } else {
        console.error(`No mark input found for student ID: ${student._id}`);
      }
    });
  
    // If any mark is invalid, don't proceed with the request.
    if (!isValid) {
      return;
    }
  
    console.log('Marks Data to be sent:', marksData); // Log the data before sending it.
  
    // Ensure that marksData has at least one entry before proceeding.
    if (marksData.length === 0) {
      alert('Please enter marks for at least one student.');
      return;
    }
  
    // Send the collected marksData to the server.
    try {
      const response = await fetch(`${API_BASE_URL}/api/faculty/marks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ marks: marksData }),
      });
  
      if (response.ok) {
        alert('Marks saved successfully!');
        await refreshMarksTable(); // Refresh the marks table with updated data.
      } else {
        const result = await response.json();
        alert('Failed to save marks: ' + result.message);
      }
    } catch (err) {
      console.error('Error during saving marks:', err);
      alert('Error saving marks. Please try again.');
    }
  }
  






  async function updateMark(studentId) {
    const mark = document.getElementById(`mark-${studentId}`).value;
    const numericMark = Number(mark);

    if (numericMark < 0 || numericMark > 100) {
      alert('Marks must be between 0 and 100.');
      return;
    }

    if (mark === '') {
      alert('Please enter a mark before updating.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/faculty/marks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          courseId: selectedCourseId,
          component: selectedComponent,
          marks: numericMark,
        }),
      });

      if (response.ok) {
        alert('Marks updated successfully!');
        await refreshMarksTable();  // Fetch and display updated marks
      } else {
        const result = await response.json();
        alert('Failed to update marks: ' + result.message);
      }
    } catch (err) {
      console.error('Error during updating marks:', err);
      alert('Error updating marks. Please try again.');
    }
  }





  async function refreshMarksTable() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/faculty/marks?courseId=${selectedCourseId}&component=${selectedComponent}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    studentsList = await response.json();
    const tbody = document.querySelector('#marks-table tbody');
    tbody.innerHTML = '';

    if (studentsList.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No students enrolled in this course</td></tr>';
    } else {
      studentsList.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.studentName}</td>
          <td>${student.studentPRN}</td>
          <td>${student.marks || 'No marks entered'}</td>
          <td><input type="number" min="0" max="100" id="mark-${student.studentId}" value="${student.marks || ''}" placeholder="Enter Marks"></td>
          <td><button onclick="updateMark('${student.studentId}')">Update</button></td>
        `;
        tbody.appendChild(row);
      });
    }
  }









  function showStudentDashboard() {
    document.getElementById('student-dashboard').style.display = 'block';
  }






  async function viewComponentMarks(component) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/students/marks/component?component=${component}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const marks = await response.json();
    const marksResultDiv = document.getElementById('marks-result');
    marksResultDiv.innerHTML = '<table><thead><tr><th>Cosurse</th><th>Marks</th></tr></thead><tbody></tbody></table>';
    const tbody = marksResultDiv.querySelector('tbody');

    if (marks.length === 0) {
      marksResultDiv.innerHTML = '<p>No marks found for this component</p>';
    } else {
      marks.forEach(mark => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${mark.course}</td><td>${mark.marks}</td>`;
        tbody.appendChild(row);
      });
    }
  }










  async function viewEntireResult() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/students/marks/entire-result`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const results = await response.json();
    const marksResultDiv = document.getElementById('marks-result');
    marksResultDiv.innerHTML = '<table><thead><tr><th>Course</th><th>Total CAs</th><th>Avg CAs</th><th>ESE</th></tr></thead><tbody></tbody></table>';
    const tbody = marksResultDiv.querySelector('tbody');

    results.forEach(result => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${result.course}</td><td>${result.totalCAs}</td><td>${result.avgCAs}</td><td>${result.ESE}</td>`;
      tbody.appendChild(row);
    });
  }
    