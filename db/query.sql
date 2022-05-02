select employee.id, employee.first_name, employee.last_name, role.title as roleTitle, department.name as departmentName, role.salary, manager.first_name AS managerName
    from (
    (employee INNER JOIN role ON role_id = role.id)
    inner join 
    (select * from employee) as manager
    on manager.id = employee.manager_id
    INNER JOIN 
    department 
    ON department_id = department.id
    );