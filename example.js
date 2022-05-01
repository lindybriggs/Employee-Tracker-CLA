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

  const [employees] = await db.execute("select * from employee")

  console.table(employees);

  const { employee } = await prompt([{
    type: 'list',
    name: 'employee',
    message: 'Which employee do you want to talk to?',
    choices: employees.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee }))
  }])
  
  console.log(employee)

  /// write next sql statements here! you would do some sort of sql query after this

}