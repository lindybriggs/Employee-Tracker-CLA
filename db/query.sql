SELECT employee.first_name, employee.last_name, role.title FROM role
JOIN employee
ON role.id = employee.role_id;