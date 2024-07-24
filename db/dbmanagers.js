const inquirer = require('inquirer');

function addGap(num){
    let output="";
    for(let i=0; i < num; i++ ){
        output += " ";
    }
    return output;
}

function mainmenu(db){
    inquirer.prompt([{
        type: 'list',
        message:'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add Department',
            'Add Role',
            'Add Employee',
            'Update Employee Role',
            'Exit'
        ],
        name: 'selection',
        loop: false
    }])
        .then((data)=>{
            switch(data.selection){
                case 'View All Departments': viewDepartments(db);
                    break;
                case 'View All Roles': viewRoles(db);
                    break;
                case 'View All Employees': viewEmployees(db);
                    break;
                case 'Add Department': addDepartment(db);
                    break;
                case 'Add Role': addRole(db);
                    break;
                case 'Add Employee': addEmployee(db);
                    break;
                case 'Update Employee Role': changeEmployeeRole(db);
                    break;
                case 'Exit': process.exit();
                    break;
            }
        })
};

function viewDepartments(db){
    db.query('SELECT * FROM departments', (err, results)=>{
        console.log(`\nid\tname\n--\t----`);
        for(let row of results){
            console.log(`${row.id}\t${row.name}`);
        }
        console.log('\n');
        mainmenu(db);
    });
};

function addDepartment(db){
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please name the new department:',
            name: 'newDeptName'
        }
    ])
    .then((data)=>{
        let ansQuery = `INSERT INTO departments (name) VALUES ('${data.newDeptName}')`;

        db.query(ansQuery, (err, results)=>{
            if(err) throw err;
            console.log(`\nDepartment ${data.newDeptName} added successfully!\n`);
            mainmenu(db);
        });
        
    });

    
};

function viewEmployees(db){
    db.query(`SELECT 
                e.id, 
                e.firstName, 
                e.lastName, 
                r.title AS roleTitle, 
                r.salary AS salary,
                d.name AS departmentName,
                CONCAT(m.firstName," ", m.lastName) AS manager
            FROM employees e
            JOIN roles r ON e.roleId=r.id
            JOIN departments d ON r.departmentId=d.id
            LEFT JOIN employees m ON e.managerId=m.id;`, 
        (err, results)=>{
        
            console.log(`\nid\
\tfirst name\
\tlast name\
\trole\
\t\tdepartment\
\tsalary\
\t\tmanager\
\n--\
\t---------------\
\t---------------\
\t---------------\
\t---------------\
\t---------------\
\t---------------`
            );
            
            for(let row of results){
                console.log(`${row.id}\
\t${row.firstName}\
\t\t${row.lastName}\
\t\t${row.roleTitle}\
\t${row.departmentName}\
\t\t${row.salary}\
\t\t${row.manager}`
                );
            }
            
            console.log('\n');
            mainmenu(db);
    });
};

function viewRoles(db){
    db.query(`SELECT 
        r.id, 
        r.title,  
        r.salary,
        d.name AS departmentName    
    FROM roles r
    JOIN departments d ON r.departmentId=d.id;`, 
(err, results)=>{

    console.log(`\nid\
\trole\
\t\tdepartment\
\tsalary\
\n--\
\t---------------\
\t---------------\
\t---------------`
    );
    
    for(let row of results){
        console.log(`${row.id}\
\t${row.title}\
\t${row.departmentName}\
\t\t${row.salary}`
        );
    }
    
    console.log('\n');
    mainmenu(db);
});
};

async function addRole(db){
    const departmentData = await getDepartments(db);
    //const departmentNames = departmentData.map(dept => dept.name);

    await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the new role:',
            name: 'newRoleTitle'
        },
        {
            type: 'input',
            message: 'What is the salary for the new role:',
            name: 'newRoleSalary'
        },
        {
            type: 'list',
            name: 'departmentChoice',
            message: 'What department is the new role in:',
            choices: departmentData.map(dept => dept.name),
        }
    ])
    .then((data)=>{
        
        //const departmentID = departmentData.map((dept)=>{if(dept.name===data.departmentChoice){return dept.id;}});

        let ansQuery = `INSERT INTO roles (title, salary, departmentId) VALUES ('${data.newRoleTitle}','${data.newRoleSalary}','${departmentData.find(dept => dept.name===data.departmentChoice)?.id}')`;

        db.query(ansQuery, (err, results)=>{
            if(err) throw err;
            console.log(`\nNew role ${data.newRoleTitle} added successfully!\n`);
            mainmenu(db);
        });
        
    });

};

async function addEmployee(db){
    const roleData = await getRoles(db);
    const managerData = await getEmployees(db);

    // console.log(roleData);
    // console.log(managerData);

    await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the new employee\'s first name:',
            name: 'newFirstName'
        },
        {
            type: 'input',
            message: 'What is the new employee\'s last name:',
            name: 'newLastName'
        },
        {
            type: 'list',
            name: 'roleChoice',
            message: 'What role will they have:',
            choices: roleData.map(role => role.title),
        },
        {
            type: 'list',
            name: 'managerChoice',
            message: 'Who will be their manager?',
            choices: managerData.map(mngr => {
                let name = `${mngr.firstName} ${mngr.lastName}`;
                return name;
            }),
        }

    ])
    .then((data)=>{
        
        const managerID = managerData.find((mngr)=>{
            const mngrName = data.managerChoice.split(' ');

            return (mngr.firstName===mngrName[0] && mngr.lastName===mngrName[1]);                
        })?.id;

        let ansQuery = `INSERT INTO employees (firstName, lastName, roleId, managerId) VALUES ('${data.newFirstName}', '${data.newLastName}', ${roleData.find(role => role.title===data.roleChoice)?.id}, ${managerID})`;

        db.query(ansQuery, (err, results)=>{
            if(err) throw err;
            console.log(`\nNew employee ${data.newFirstName} ${data.newLastName} added successfully!\n`);
            mainmenu(db);
        });
        
    });

};

async function changeEmployeeRole(db){
    const roleData = await getRoles(db);
    const employeeData = await getEmployees(db);


    const employeeRes = await inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee\'s role would you like to change?',
            name: 'choice',
            choices: employeeData.map(emp => {
                let name = `${emp.firstName} ${emp.lastName}`;
                return name;
            }),
        }
    ]);
        
    const roleRes = await inquirer.prompt([
        {
            type: 'list',
            message: 'What will be their new role:',
            name: 'choice',
            choices: roleData.map(role => role.title),
        }

    ]);

    // console.log(employeeRes.choice);
    // console.log(roleRes.choice);

    if(employeeRes && roleRes){
        const employeeId = employeeData.find((emp)=>{
            const empName = employeeRes.choice.split(' ');

            return (emp.firstName===empName[0] && emp.lastName===empName[1]);                
        })?.id;

        let ansQuery = `UPDATE employees SET roleId = ${roleData.find(role => role.title===roleRes.choice)?.id} WHERE id = ${employeeId}`;

        db.query(ansQuery, (err, results)=>{
            if(err) throw err;
            console.log(`\n${employeeRes.choice}'s role updated successfully!\n`);
            mainmenu(db);
        });
    }


};


function getDepartments(db) {

    return new Promise((resolve)=>{
        db.query(`SELECT * FROM departments`, (err, results)=>{
            const choices = results.map(result => ({
                id: result.id,
                name: result.name
            }));
            resolve(choices);
        });
    });

}
function getRoles(db) {

    return new Promise((resolve)=>{
        db.query(`SELECT * FROM roles`, (err, results)=>{
            const roleChoices = results.map(result => ({
                id: result.id,
                title: result.title
            }));
            resolve(roleChoices);
        });
    });

}
function getEmployees(db) {

    return new Promise((resolve)=>{
        db.query(`SELECT * FROM employees`, (err, results)=>{
            const empChoices = results.map(result => ({
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName
            }));
            resolve(empChoices);
        });
    });

}
// function removeDepartment(){
//     let resList =[];
//     db.query('SELECT * FROM departments', (err, results)=>{
//         for(let row of results){
//             resList.push(row.name);
//         }
//     });

//     console.log(resList);
// };
// function removeRole(){};
// function removeEmployee(){};



module.exports = {   
    mainmenu,
    viewDepartments,
    viewEmployees,
    viewRoles,
    addDepartment,
    addRole,
    addEmployee,
    changeEmployeeRole,
    // removeRole,
    // removeDepartment,
    // removeEmployee
};