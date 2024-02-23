const inquirer = require("inquirer");
const cTable = require('console.table');
const dbConnection = require('./mysql');
var connection = dbConnection.dbConnection();

module.exports = {

    name(id, cb) {
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'New First name:',
                    name: 'firstName',
                },
                {
                    type: 'input',
                    message: 'New Last name:',
                    name: 'lastName',
                },
            ],
            )
            .then((response) => {
                connection.query(`UPDATE employee SET ? WHERE id= ${id}`,
                    {
                        first_name: response.firstName,
                        lat_name: response.lastName,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log("Name updated sucessfully!\n");
                        cb();
                    })
            })
    },

    role(id, cb) {
        inquirer
            .prompt(
                {
                    type: 'input',
                    message: 'New Role ID:',
                    name: 'role',
                },
            )
            .then((response) => {
                connection.query(`UPDATE employee SET ? WHERE id= ${id}`,
                    {
                        role_id: response.role,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log("Role updated sucessfully!\n");
                        cb();
                    })
            })
    },

    manager(id, cb) {
        inquirer
            .prompt(
                {
                    type: 'input',
                    message: 'New Manager ID:',
                    name: 'manager',
                },
            )
            .then((response) => {
                connection.query(`UPDATE employee SET ? WHERE id= ${id}`,
                    {
                        manager_id: response.manager,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log("Manager updated sucessfully!\n");
                        cb();
                    })
            })
    },
}