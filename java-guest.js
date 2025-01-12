let employees = [];

const employeeForm = document.getElementById('employeeForm');
const tableBody = document.getElementById('employeeTableBody');
const reportSection = document.getElementById('report');
let editingIndex = null;

employeeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const employee = {
        id: document.getElementById('id').value,    
        name: document.getElementById('name').value,
        qualification: document.getElementById('qualification').value,
        graduationYear: document.getElementById('graduationYear').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        initialAssignment: document.getElementById('initialAssignment').value,
        initialAssignmentFrom: document.getElementById('initialAssignmentFrom').value,
        initialAssignmentTo: document.getElementById('initialAssignmentTo').value,
        secondAssignment: document.getElementById('secondAssignment').value,
        secondAssignmentFrom: document.getElementById('secondAssignmentFrom').value,
        secondAssignmentTo: document.getElementById('secondAssignmentTo').value,
        ministerialDecisionNumber: document.getElementById('ministerialDecisionNumber').value,
        ministerialDecisionDate: document.getElementById('ministerialDecisionDate').value,
        currentWorkplace: document.getElementById('currentWorkplace').value,
        workStartDate: document.getElementById('workStartDate').value,
        terminationDecisionText: document.getElementById('terminationDecisionText').value,
        terminationDecisionDate: document.getElementById('terminationDecisionDate').value,
    };

    const action = editingIndex !== null ? 'update' : 'insert';

    fetch('process_form.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, employee, index: editingIndex })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        renderTable();
        employeeForm.reset();
        editingIndex = null;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function renderSearchResults(filteredEmployees) {
    tableBody.innerHTML = '';
    filteredEmployees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.employee_id}</td>
            <td>${employee.name}</td>
            <td>${employee.qualification}</td>
            <td>${employee.graduation_year}</td>
            <td><button onclick="viewReport(${index})">عرض التقرير</button></td>
            <td><button onclick="editEmployee(${index})">تعديل</button></td>
            <td><button onclick="deleteEmployee(${index})">حذف</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// دالة البحث
function searchEmployee() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredEmployees = employees.filter(employee => 
        employee.employee_id.toLowerCase().includes(searchInput) || 
        employee.name.toLowerCase().includes(searchInput)
    );
    renderSearchResults(filteredEmployees);
}


function renderTable() {
    fetch('process_form.php', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        employees = data;
        tableBody.innerHTML = '';
        employees.forEach((employee, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.employee_id}</td>
                <td>${employee.name}</td>
                <td>${employee.qualification}</td>
                <td>${employee.graduation_year}</td>
                <td><button onclick="viewReport(${index})">عرض التقرير</button></td>
                <td><button onclick="editEmployee(${index})">تعديل</button></td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function viewReport(index) {
    const employee = employees[index];
    
    // بناء محتوى التقرير مع التحقق من الحقول الفارغة
    let reportContent = ` 
        <div class="report-header">تقرير الموظف</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
                <td><strong>الرقم التعريفي:</strong></td>
                <td>${employee.employee_id || "غير متوفر"}</td>
            </tr>
            <tr>
                <td><strong>الاسم:</strong></td>
                <td>${employee.name || "غير متوفر"}</td>
            </tr>
            <tr>
                <td><strong>المؤهل العلمي:</strong></td>
                <td>${employee.qualification || "غير متوفر"}</td>
            </tr>
            <tr>
                <td><strong>سنة الحصول على المؤهل:</strong></td>
                <td>${employee.graduation_year || "غير متوفر"}</td>
            </tr>
            <tr>
                <td><strong>رقم التليفون:</strong></td>
                <td>${employee.phone || "غير متوفر"}</td>
            </tr>
            <tr>
                <td><strong>العنوان:</strong></td>
                <td>${employee.address || "غير متوفر"}</td>
            </tr>
            <tr>
                <td><strong>جهة التكليف الأولي:</strong></td>
                <td>${employee.initial_assignment || "غير متوفر"}</td>
            </tr>
            <tr>
                <td><strong>من تاريخ التكليف الأولي:</strong></td>
                <td>${employee.initial_assignment_from || "غير متوفر"}</td>
            </tr>
            <tr>
                <td><strong>إلى تاريخ التكليف الأولي:</strong></td>
                <td>${employee.initial_assignment_to || "غير متوفر"}</td>
            </tr>
            ${employee.second_assignment ? `
                <tr>
                    <td><strong>جهة التكليف الثانية:</strong></td>
                    <td>${employee.second_assignment || "غير متوفر"}</td>
                </tr>
                <tr>
                    <td><strong>من تاريخ التكليف الثاني:</strong></td>
                    <td>${employee.second_assignment_from || "غير متوفر"}</td>
                </tr>
                <tr>
                    <td><strong>إلى تاريخ التكليف الثاني:</strong></td>
                    <td>${employee.second_assignment_to || "غير متوفر"}</td>
                </tr>
            ` : ''}
            ${employee.termination_decision_text ? `
                <tr>
                    <td><strong>قرار إلغاء الاستعانة:</strong></td>
                    <td>${employee.termination_decision_text || "غير متوفر"}</td>
                </tr>
                <tr>
                    <td><strong>تاريخ إلغاء الاستعانة:</strong></td>
                    <td>${employee.termination_decision_date || "غير متوفر"}</td>
                </tr>
            ` : ''}
            <tr>
                <td><strong>رقم القرار الوزاري بالاستعانة:</strong></td>
                <td>${employee.ministerial_decision_number || "غير متوفر"}</td>
            </tr>
            <tr>
                <td><strong>تاريخ القرار الوزاري بالاستعانة:</strong></td>
                <td>${employee.ministerial_decision_date || "غير متوفر"}</td>
            </tr>
            <tr>
                <td><strong>جهة العمل الحالية:</strong></td>
                <td>${employee.current_workplace || "غير متوفر"}</td>
            </tr>
            <tr>
                <td><strong>تاريخ استلام العمل:</strong></td>
                <td>${employee.work_start_date || "غير متوفر"}</td>
            </tr>
        </table>
        <div class="form-buttons">
            <button class="no-print" id="report-buttons" onclick="printReport()">طباعة التقرير</button>
            <button class="no-print" id="report-buttons" onclick="closeReport()">إغلاق التقرير</button>
        </div>
    `;
    
    reportSection.innerHTML = reportContent;
    reportSection.style.display = 'block';
}


function printReport() {
    window.print();
}


function closeReport() {
    reportSection.style.display = 'none';
}

function editEmployee(index) {
    const employee = employees[index];
    document.getElementById('id').value = employee.employee_id;
    document.getElementById('name').value = employee.name;
    document.getElementById('qualification').value = employee.qualification;
    document.getElementById('graduationYear').value = employee.graduation_year;
    document.getElementById('phone').value = employee.phone;
    document.getElementById('address').value = employee.address;
    document.getElementById('initialAssignment').value = employee.initial_assignment;
    document.getElementById('initialAssignmentFrom').value = employee.initial_assignment_from;
    document.getElementById('initialAssignmentTo').value = employee.initial_assignment_to;
    document.getElementById('secondAssignment').value = employee.second_assignment;
    document.getElementById('secondAssignmentFrom').value = employee.second_assignment_from;
    document.getElementById('secondAssignmentTo').value = employee.second_assignment_to;
    document.getElementById('ministerialDecisionNumber').value = employee.ministerial_decision_number;
    document.getElementById('ministerialDecisionDate').value = employee.ministerial_decision_date;
    document.getElementById('currentWorkplace').value = employee.current_workplace;
    document.getElementById('workStartDate').value = employee.work_start_date;
    document.getElementById('terminationDecisionText').value = employee.termination_decision_text;
    document.getElementById('terminationDecisionDate').value = employee.termination_decision_date;
    document.getElementById("submitButton").innerHTML="تعديل الموظف";
    editingIndex = index;
    window.scrollTo(0, 0);
}



// تحميل البيانات عند فتح الصفحة
renderTable();