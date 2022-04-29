const { prompt } = require("inquirer");
const mysql = require('mysql2/promise');
let db;
  
awaitMySqlWithInquirer();

async function init(){
    db =await mysql.createConnection(
        {
          host: 'localhost',
          user: 'root',
          password: 'root',
          database: 'employees'
        },
        console.log(`Connected to the employees_db database.`)
      );


}
async function awaitMySqlWithInquirer(){
    await init()

    const [employees] =  await db.execute("select * from employee")

    console.table(employees);
    
       const {employee} = await prompt([{
                type: 'list',
                name: 'employee',
                message: 'What employee do you want to talk to?',
                choices: employees.map(employee=> ({name:employee.first_name + " "+ employee.last_name, value: employee}))
              }])
        
              console.log(employee)

              
                /// write next sql statements here! you would do some sort of sql query after this
              
    }
    



async function awaitWithInquirerByItself(){
 
    
       const {size} = await prompt([{
                type: 'list',
                name: 'size',
                message: 'What size do you need?',
                choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro']
              }])
        
          console.log(size);
        
    }






