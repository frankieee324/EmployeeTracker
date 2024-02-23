const inquirer = require("inquirer");
const cTable = require('console.table');
const dbConnection = require('./mysql');
var connection = dbConnection.dbConnection();

module.exports = {
    deleteEmployee(cb) {
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'Employee first name:',
                    name: 'firstName',
                },
                {
                    type: 'input',
                    message: 'Employee last name',
                    name: 'lastName',
                }
            ])
            .then((response) => {
                connection.query(`DELETE FROM employee  WHERE ?`,
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
                        if (res.affectedRows != 0) {
                            console.log("Employee Deleted sucessfully!\n");
                            
                        } else {
                            console.log("Employee Not found.\n");
                        }
                        cb();
                    })
            })
    },

    deleteDepartment(cb) {
        let departments = [];
        connection.query(`SELECT * FROM department`,
            (err, res) => {
                if (err) throw err;
                res.forEach((data) => {
                    departments.push(data.name);
                })
                deleteDepartment2(departments, cb);

            })

    },

    deleteRole(cb) {
        inquirer
            .prompt(
                {
                    type: 'input',
                    message: 'Role ID',
                    name: 'id',
                },
            )
            .then((response) => {
                connection.query(`DELETE FROM role  WHERE ?`,
                    {
                        id: response.id,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log("Role Deleted sucessfully!\n");
                        cb();
                    })
            })
    }


};

function deleteDepartment2(departments, cb){
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
        console.log(response);
        connection.query(`DELETE FROM department  WHERE ?`,
            {
                name: response.department,
            },
            (err, res) => {
                if (err) throw err;
                console.log("Department Deleted sucessfully!\n");
                cb();
            })
    })
}