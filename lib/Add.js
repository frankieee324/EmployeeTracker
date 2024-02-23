const inquirer = require("inquirer");
const cTable = require('console.table');
const dbConnection = require('./mysql');
var connection = dbConnection.dbConnection();
const roles = [];

module.exports = {
    addEmployee(cb) {

        connection.query(`SELECT title FROM role`,
            (err, res) => {
                if (err)
                    throw err;
                res.forEach((data) => {
                    roles.push(data.title);
                });
                
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: 'First name:',
                            name: 'firstName',
                        },
                        {
                            type: 'input',
                            message: 'Last name',
                            name: 'lastName',
                        },
                        {
                            type: 'list',
                            message: 'Role ID',
                            name: 'role',
                            choices: roles,
                        },
                        {
                            type: 'input',
                            message: 'Manager ID',
                            name: 'managerID',
                        }
                    ])
                    .then((response) => {
                        let roleID = roles.indexOf(response.role);
                        roleID += 1;
                        console.log(roleID);
                        connection.query(`INSERT INTO employee SET ?`,
                            {
                                first_name: response.firstName,
                                lat_name: response.lastName,
                                role_id: roleID,
                                manager_id: response.managerID,
                            },
                            (err, res) => {
                                if (err) throw err;
                                console.log("Employee added sucessfully!\n");
                                cb();
                            })
                    })
            })


    },

    addDepartment(cb) {
        connection.query(`SELECT max(id) AS maxid FROM department`,
        (err, res) => {
            let maxId = res[0].maxid+1;
        inquirer
            .prompt(
                {
                    type: 'input',
                    message: 'Department Name:',
                    name: 'department',
                },
            )
            .then((response) => {
                connection.query(`INSERT INTO department SET ?`,
                    {
                        id : maxId,
                        name: response.department,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Department added sucessfully with the id of: ${maxId}!\n`);
                        cb();
                    })
            })
        })
    },

    addRole(cb) {
        connection.query(`SELECT max(id) AS maxid FROM role`,
        (err, res) => {
            let maxId = res[0].maxid+1;
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'Role title:',
                    name: 'title',
                },
                {
                    type: 'input',
                    message: 'Salary:',
                    name: 'salary',
                },
                {
                    type: 'input',
                    message: 'Department ID',
                    name: 'departmentID',
                },
            ])
            .then((response) => {
                connection.query(`INSERT INTO role SET ?`,
                    {
                        id: maxId,
                        title: response.title,
                        salary: response.salary,
                        department_id: response.departmentID,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Role added sucessfully with the id of: ${maxId}!\n`);
                        cb();
                    })
            })
        })
    }
};