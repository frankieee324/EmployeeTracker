const inquirer = require("inquirer");
const modules = require("./lib/Module");



function begin() {

    inquirer
        .prompt(
            {
                type: 'list',
                message: 'Pick one option:',
                name: 'choice',
                choices: [
                    'View all employees',
                    'Add Employee/Role/Department',
                    'Delete Employee/Role/Department',
                    'Update employee',
                    'View Departments',
                    'View Roles',
                    'Exit'
                ]
            })
        .then((response) => {
            switch (response.choice) {
                case 'View all employees':
                    modules.view(begin);
                    break;
                case 'Add Employee/Role/Department':
                    modules.add(begin);
                    break;
                case 'Delete Employee/Role/Department':
                    modules.delete(begin);
                    break;
                case 'Update employee':
                    modules.updateEmployee(begin);
                    break;
                case 'View Departments':
                    modules.viewDepartments(begin);
                    break;
                case 'View Roles':
                    modules.viewRoles(begin);
                    break;
                default:
                    process.exit()
            }
        })

}


begin();