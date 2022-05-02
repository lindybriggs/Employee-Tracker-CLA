const { prompt } = require("inquirer");
const mysql = require('mysql2/promise');

let db;

promptUser();

async function init() {
    db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'company_db'
        },
        console.log(`Connected to the employees_db database.`)
    );
}

async function promptUser() {
    await init()

    const [departments] = await db.execute("select * from department")
    const [roles] = await db.execute("select * from role")
    const [employees] = await db.execute("select * from employee")

    const { option } = await prompt([{
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    }])

    console.log(`You chose to: ${option}`)

    if (option === 'View all departments') {
        console.table(departments)
    } else if (option === 'View all roles') {
        console.table(roles)
    } else if (option === 'View all employees') {
        console.table(employees)
    } else if (option === 'Add a department') {
        addDepartment();
    } else if (option === 'Add a role') {
        addRole(departments);
    } else if (option === 'Add an employee') {
        addEmployeePrompt(roles, employees);
    } else {
        updateEmployeePrompt();
    }

}
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
async function addDepartment() {
    const { newDepartment } = await prompt([{
        type: 'input',
        name: 'newDepartment',
        message: 'Enter the department name you want to add to the list.',
    }])
    console.log(newDepartment);
    addDepartment(newDepartment)

    async function addDepartment(newDepartment) {
        const departmentName = newDepartment;
        let query = 'INSERT into department (name) VALUES (?)';
        let args = [departmentName];
        const help = await db.query(query, args);
        console.log(`Added department named ${departmentName}`);
        const [departments] = await db.execute("select * from department")
        console.table(departments);
    }

}
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
async function addRole(departments) {
    // const [currentDepartments] = await db.execute("select * from department")

    const response = await prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the new role.',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary of the new role.',
        },
        {
            type: 'list',
            name: 'department',
            message: 'Choose the department for the new role.',
            choices: departments.map(department => ({ name: department.name, value: department }))
        },
    ])

    // console.log(title);
    // console.log(salary);
    // console.log(department.name);
    const { title, salary, department } = response
    console.log(title, salary, department);
    addRole(title, salary, department)

    async function addRole(title, salary, department) {
        const roleTitle = title;
        const roleSalary = salary;
        const roleDepartment = department.id;

        let query = 'INSERT into role (title, salary, department_id) VALUES (?, ?, ?)';
        let args = [roleTitle, roleSalary, roleDepartment];
        const help = await db.query(query, args);
        console.log(`Added role titled ${roleTitle} with salary of ${roleSalary}`);

        const [roles] = await db.execute("select * from role")
        console.table(roles);
    }
}

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
async function addEmployeePrompt(roles, employees) {
    const response = await prompt([
        {
            type: 'input',
            name: 'firstName',
            message: `Enter the new employee's first name.`,
        },
        {
            type: 'input',
            name: 'lastName',
            message: `Enter the new employee's last name.`,
        },
        {
            type: 'list',
            name: 'role',
            message: `Choose the new employee's role.`,
            choices: roles.map(role => ({ name: role.title, value: role }))
        },
        {
            type: 'list',
            name: 'manager',
            message: `Who is the new employee's manager?`,
            choices: employees.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee }))
        },
    ])

    const { firstName, lastName, role, manager } = response
    // console.log(firstName);
    // console.log(lastName);
    // console.log(role.id);
    // console.log(firstName, lastName, role, manager);
    addEmployee(firstName, lastName, role, manager)

    async function addEmployee(firstName, lastName, role, manager) {
        const employeeFN = firstName;
        const employeeLS = lastName;
        const employeeRole = role.id;
        const employeeManager = manager.id

        let query = 'INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        let args = [employeeFN, employeeLS, employeeRole, employeeManager];
        const help = await db.query(query, args);
        console.log(`Added employee named ${employeeFN} ${employeeLS}.`);

        const [employees] = await db.execute("select * from employee")
        console.table(employees);
    }
}


async function updateEmployeePrompt() {
    const [roles] = await db.execute("select * from role")
    const [employees] = await db.execute("select * from employee")
    const response = await prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee do you want to update?',
            choices: employees.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee }))
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is their new role?',
            choices: roles.map(role => ({ name: role.title, value: role }))
        },
    ])

    const { employee, role } = response
    console.log(employee, role);
    updateRole(employee, role)

    async function updateRole(employee, role) {
        const employeeName = employee.first_name;
        const roleTitle = role.title;
        const employeeId = employee.id;
        const newRole = role.id;

        let query = 'UPDATE employee SET role_id=? where id=?;';
        let args = [newRole, employeeId];
        const help = await db.query(query, args);
        console.log(`Updated ${employeeName}'s role to ${roleTitle}`);

        const [employees] = await db.execute("SELECT employee.first_name, employee.last_name, role.title FROM role JOIN employee ON role.id = employee.role_id;")
        console.table(employees);
    }
}