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
            console.log(`Department ${data.newDeptName} added successfully!`);
            mainmenu(db);
        });
        
    });

    
};


function viewEmployees(db){
    db.query('SELECT * FROM employees', (err, results)=>{
        console.log(`\nid\tfirst name\tlast name${addGap(3)}\trole${addGap(9)}\tdepartment${addGap(10)}\tsalary${addGap(9)}\tmanager\n--\t----------\t---------\t---------------\t----------------\t----------\t----------------`);
        for(let row of results){
            console.log(`${row.id}\t${row.firstName}`);
        }
        console.log('\n');
        mainmenu(db);
    });
};
function viewRoles(db){};
function addRole(db){};
function addEmployee(db){};
function changeEmployeeRole(db){};


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