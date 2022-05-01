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
        addRole(departments, roles);
    }

}

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

async function addRole(departments, roles) {
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
    console.log( title, salary, department );
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