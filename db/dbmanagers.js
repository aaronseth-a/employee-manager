const inquirer = require('inquirer');

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
    // inquirer.prompt([{
    //     type: 'list',
    //     message:'? What would you like to do?',
    //     choices: [
    //         'View All Departments',
    //         'View All Roles',
    //         'View All Employees',
    //         'Add Department',
    //         'Add Role',
    //         'Add Employee',
    //         'Update Employee Role'
    //     ],
    //     name: 'selection'
    // }])
    //     .then((data)=>{
    //         switch(data.selection){
    //             case 'View All Departments': viewDepartments();
    //                 break;
    //             case 'View All Roles': viewRoles();
    //                 break;
    //             case 'View All Employees': viewEmployees();
    //                 break;
    //             case 'Add Department': addDepartment();
    //                 break;
    //             case 'Add Role': addRole();
    //                 break;
    //             case 'Add Employee': addEmployee();
    //                 break;
    //             case 'Update Employee Role': changeEmployeeRole();
    //                 break;
    //         }
    //     })
};
function viewEmployees(){};
function viewRoles(){};
function addDepartment(){};
function addRole(){};
function addEmployee(){};
function changeEmployeeRole(){};
function removeRole(){};
function removeDepartment(){};
function removeEmployee(){};

module.exports = {   
    mainmenu,
    viewDepartments,
    viewEmployees,
    viewRoles,
    addDepartment,
    addRole,
    addEmployee,
    changeEmployeeRole,
    removeRole,
    removeDepartment,
    removeEmployee
};