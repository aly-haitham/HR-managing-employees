<?php
// إعداد الاتصال بقاعدة البيانات
$servername = "localhost"; // يمكن تغييره حسب إعدادات السيرفر
$username = "root"; // اسم المستخدم
$password = ""; // كلمة المرور (إن وجدت)
$dbname = "employeemanagement"; // اسم قاعدة البيانات

// إنشاء الاتصال
$conn = new mysqli($servername, $username, $password, $dbname);

// التحقق من الاتصال
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// معالجة البيانات المرسلة عبر الـ fetch بصيغة JSON
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // إضافة أو تعديل موظف
    if (isset($data['action'])) {
        if ($data['action'] == 'insert') {
            // إضافة موظف
            $employee = $data['employee'];
            $stmt = $conn->prepare("INSERT INTO employees (employee_id, name, qualification, graduation_year, phone, address, initial_assignment, initial_assignment_from, initial_assignment_to, second_assignment, second_assignment_from, second_assignment_to, ministerial_decision_number, ministerial_decision_date, current_workplace, work_start_date, termination_decision_text, termination_decision_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssssssssssssssss", $employee['id'], $employee['name'], $employee['qualification'], $employee['graduationYear'], $employee['phone'], $employee['address'], $employee['initialAssignment'], $employee['initialAssignmentFrom'], $employee['initialAssignmentTo'], $employee['secondAssignment'], $employee['secondAssignmentFrom'], $employee['secondAssignmentTo'], $employee['ministerialDecisionNumber'], $employee['ministerialDecisionDate'], $employee['currentWorkplace'], $employee['workStartDate'], $employee['terminationDecisionText'], $employee['terminationDecisionDate']);
            $stmt->execute();
            echo json_encode(["message" => "تم إضافة الموظف بنجاح"]);
        } elseif ($data['action'] == 'update') {
            // تحديث موظف
            $employee = $data['employee'];
            $id = $data['index']; // استخدام id بدلاً من index
            $stmt = $conn->prepare("UPDATE employees SET employee_id = ?, name = ?, qualification = ?, graduation_year = ?, phone = ?, address = ?, initial_assignment = ?, initial_assignment_from = ?, initial_assignment_to = ?, second_assignment = ?, second_assignment_from = ?, second_assignment_to = ?, ministerial_decision_number = ?, ministerial_decision_date = ?, current_workplace = ?, work_start_date = ?, termination_decision_text = ?, termination_decision_date = ? WHERE employee_id = ?");
            $stmt->bind_param("ssssssssssssssssssi", $employee['id'], $employee['name'], $employee['qualification'], $employee['graduationYear'], $employee['phone'], $employee['address'], $employee['initialAssignment'], $employee['initialAssignmentFrom'], $employee['initialAssignmentTo'], $employee['secondAssignment'], $employee['secondAssignmentFrom'], $employee['secondAssignmentTo'], $employee['ministerialDecisionNumber'], $employee['ministerialDecisionDate'], $employee['currentWorkplace'], $employee['workStartDate'], $employee['terminationDecisionText'], $employee['terminationDecisionDate'], $employee['id']);
            $stmt->execute();
            echo json_encode(["message" => "تم تحديث الموظف بنجاح"]);
        } elseif ($data['action'] == 'delete') {
            // حذف موظف
            $id = $data['id']; // استلام الـ employee_id من الـ JSON
            $stmt = $conn->prepare("DELETE FROM employees WHERE employee_id = ?");
            $stmt->bind_param("i", $id); // استخدام الـ employee_id في الـ bind_param
            $stmt->execute();
            echo json_encode(["message" => "تم حذف الموظف بنجاح"]);
        }
    }
}

// عرض الموظفين
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM employees";
    $result = $conn->query($sql);
    $employees = [];
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }
    echo json_encode($employees);
}

// إغلاق الاتصال
$conn->close();
?>
