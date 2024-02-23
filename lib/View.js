const inquirer = require("inquirer");
const cTable = require('console.table');
const dbConnection = require('./mysql');
var connection = dbConnection.dbConnection();


module.exports = {

    viewEmployeesManager(cb) {
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'Manager first name:',
                    name: 'firstName',
                },
                {
                    type: 'input',
                    message: 'Manager last name',
                    name: 'lastName',
                }
            ])
            .then((response) => {
                connection.query(`SELECT id FROM employee WHERE ? AND ?`,
                    [
                        {
                            first_name: response.firstName,
                        },
                        {
                            lat_name: response.lastName,
                        },
                    ],
                    (err, res) => {
                        if (err) throw err;
                        if (res.length != 0) {
                            employeesManagerCB(res[0].id, response.firstName, response.lastName, cb);
                        } else {
                            console.log("Manager Not found.\n");
                            cb();
                        }
                    })
            })
    },

    viewEmployeesDepartment(cb) {
        let departments = [];
        connection.query(`SELECT * FROM department`,
            (err, res) => {
                if (err) throw err;
                res.forEach((data) => {
                    departments.push(data.name);
                })
                generateDepartment(departments, cb);

            })

    },

    viewEmployees(cb) {
        console.log('My Employees...\n');
        connection.query(`
        SELECT employee.id as Unique_ID, employee.first_name, employee.lat_name AS last_name,
        role.title, department.name AS department
        FROM employee 
        INNER JOIN role ON employee.role_id=role.id
        INNER JOIN department ON role.department_id=department.id`,
            (err, res) => {
                if (err) throw err;

                console.log(`You have a total of ${res.length} Employees. \n`);
                if (res.length != 0) {
                    console.table(res)
                    cb();
                }
            })
    },

    viewDepartments(cb) {
        let final;
        let result;
        console.log('My Departments...\n');
        //Select all the data from each Dept
        connection.query(`SELECT * FROM department`,
            async (err, res) => {
                let dptData = [];
                if (err) throw err;
                console.log(`You have a total of ${res.length} Departments. \n`);
                if (res.length != 0) {
                    //Iterate through each dept
                     result = await Promise.all(res.map((data) => {
                        let budget = 0;
                        connection.query(`SELECT * 
                        FROM role
                        INNER JOIN employee ON role.id = employee.role_id
                        WHERE role.department_id = '${data.id}'`,
                            async (err, res2) => {
                                if (err) throw err;
                                final = await Promise.all(res2.map((data2) => {
                                     budget += data2.salary;
                                }))
                                dptData.push({
                                    "Department ID": data.id,
                                    "Department Name": data.name,
                                    "Total Budget": budget,
                                });
                                
                                return dptData;
                            })
                    }));
                    // console.log(result);
                    setTimeout(function () { 
                        console.table(dptData); 
                        cb();
                    }, 500);

                }
            })
    },

    viewRoles(cb) {
        console.log('My Roles...\n');
        connection.query(`
        SELECT role.title, role.salary, department.name AS Department
        FROM role 
        INNER JOIN department ON role.department_id=department.id`,
            (err, res) => {
                if (err) throw err;

                console.log(`You have a total of ${res.length} Roles. \n`);
                if (res.length != 0) {
                    console.table(res)
                }
                cb();
            })
    }
}

function employeesManagerCB(managerId, firstName, lastName, cb) {
    connection.query(`SELECT first_name, lat_name AS last_name  FROM employee WHERE manager_id = '${managerId}'`,
        (err, res) => {
            if (err) throw err;
            if (res.length != 0) {
                //Manually add the Manager name to each value.
                let result = res.map(function (i) {
                    i.manager_name = firstName + " " + lastName;
                    return i;
                })
                console.table(result);
                cb();
            } else {
                console.log("No employee working for this Manager!\n");
                cb();
            }
        })
}

function generateDepartment(departments, cb) {

    inquirer
        .prompt(
            {
                type: 'list',
                message: 'Pick one option:',
                name: 'department',
                choices: departments
            },
        )
        .then((response) => {
            connection.query(`
            SELECT employee.first_name, employee.lat_name AS last_name,
            role.title, department.name AS department
            FROM employee 
            INNER JOIN role ON employee.role_id=role.id
            INNER JOIN department ON role.department_id=department.id WHERE department.name = '${response.department}'`,
                (err, res) => {
                    if (err) throw err;
                    if (res.length != 0) {
                        console.table(res)
                        cb();
                    }
                })
        })
}