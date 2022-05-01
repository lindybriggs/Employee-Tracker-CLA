// view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role


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

    // WHEN I choose to view all departments
    // THEN I am presented with a formatted table showing department names and department ids
    const [departments] = await db.execute("select * from department")
    console.table(departments);

    // WHEN I choose to view all roles
    // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
    const [roles] = await db.execute("SELECT department.name, role.title, role.id, role.salary FROM role JOIN department ON role.department_id = department.id;")
    console.table(roles);

    // WHEN I choose to view all employees
    // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    const [employees] = await db.execute("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, department.name, role.title, role.salary FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);")
    console.table(employees);

    // WHEN I choose to add a department
    // THEN I am prompted to enter the name of the department and that department is added to the database
            // const [addDepartment] = await db.execute("INSERT INTO department (name)VALUES(?); select * from department;")
            // console.table(addDepartment);
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