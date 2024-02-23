const inquirer = require("inquirer");
const cTable = require('console.table');

const add = require("./Add");
const view = require("./View");
const del = require("./Delete");
const update = require("./Update");

const dbConnection = require('./mysql');
var connection = dbConnection.dbConnection();

module.exports = {
    //View Employees function
    view(cb) {
        inquirer
            .prompt(
                {
                    type: 'list',
                    message: 'Pick one option:',
                    name: 'choice',
                    choices: [
                        'View all employees',
                        'View all employees by Department',
                        'View all employees by Manager',
                    ]
                })
            .then((response) => {
                switch (response.choice) {
                    case 'View all employees':
                        return view.viewEmployees(cb);
                    case 'View all employees by Department':
                        return view.viewEmployeesDepartment(cb);
                    case 'View all employees by Manager':
                        return view.viewEmployeesManager(cb);
                }
            })
    },

    //Add employee function
    add(cb) {
        inquirer
            .prompt(
                {
                    type: 'list',
                    message: 'Pick one option:',
                    name: 'choice',
                    choices: [
                        'Add an employee',
                        'Add a department',
                        'Add a role',
                    ]
                })
            .then((response) => {
                switch (response.choice) {
                    case 'Add an employee':
                        return add.addEmployee(cb);
                    case 'Add a department':
                        return add.addDepartment(cb);
                    case 'Add a role':
                        return add.addRole(cb);
                }
            })
    },

    delete(cb) {
        inquirer
            .prompt(
                {
                    type: 'list',
                    message: 'Pick one option:',
                    name: 'choice',
                    choices: [
                        'DELETE an employee',
                        'DELETE a department',
                        'DELETE a role',
                    ]
                })
            .then((response) => {
                switch (response.choice) {
                    case 'DELETE an employee':
                        return del.deleteEmployee(cb);
                    case 'DELETE a department':
                        return del.deleteDepartment(cb);
                    case 'DELETE a role':
                        return del.deleteRole(cb);
                }
            })
    },

    updateEmployee(cb) {
        inquirer
            .prompt(
                {
                    type: 'input',
                    message: 'Employee ID:',
                    name: 'id',
                },
            )
            .then((response) => {
                connection.query(`SELECT * FROM employee WHERE ?`,
                    {
                        id: response.id,
                    },
                    (err, res) => {
                        if (err) throw err;
                        if (res.length != 0) {
                            console.log(`Employee selected ${res[0].first_name} ${res[0].lat_name}.\n`)
                            inquirer
                                .prompt(
                                    {
                                        type: 'list',
                                        name: 'choice',
                                        choices: [
                                            'Update name',
                                            'Update Role ID',
                                            'Update Manager ID',
                                        ]
                                    })
                                .then((response) => {
                                    switch (response.choice) {
                                        case 'Update name':
                                            return update.name(res[0].id, cb);
                                        case 'Update Role ID':
                                            return update.role(res[0].id, cb);
                                        case 'Update Manager ID':
                                            return update.manager(res[0].id, cb);
                                    }
                                })
                        } else {
                            console.log("Employee Not found.\n");
                            cb();
                        }
                    })
            })
    },

    viewDepartments(cb) {
        return view.viewDepartments(cb);
    },

    viewRoles(cb) {
        return view.viewRoles(cb);
    }

}