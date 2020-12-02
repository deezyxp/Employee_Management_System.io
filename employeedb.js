var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "daniel1",
    database: "employee_db"
});

connection.connect(function (err, res) {
    if (err) throw err;

    askWhatWant();
});


function askWhatWant() {

    inquirer
        .prompt({
            name: "name",
            type: "list",
            message: "What would you like to do: ",
            choices: [
                "View all employees",
                "Add employee",
                "Add department",
                "Add role",
                "Update employee",
                "Delete from database"
            ]
        }).then(function (answer) {
            switch (answer.name) {
                case "View all employees":
                    viewEmployees();
                    break;

                case "Add employee":
                    addEmployee();
                    break;

                case "Add department":
                    addDepartment();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "Update employee":
                    updateEmployee();
                    break;

                case "Delete from database":
                    deleteFunc();
            }
        })
}
function viewEmployees() {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "How would you like to view employees",
            choices: [
                "First Name",
                "Last Name",
                "Department",
                "Role",
                "Manager"
            ]
        }).then(function (answer) {

            let choiceObj = {
                "First Name": "e.first_name",
                "Last Name": "e.last_name",
                "Department": "d.name",
                "Role": "r.title",
                "Manager": "e.manager_id"
            }
            let queryParam = choiceObj[`${answer.choice}`]

            var query = 'SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", IFNULL(r.title, "No Data") AS "Title", IFNULL(d.name, "No Data") AS "Department", IFNULL(r.salary, "No Data") AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager" FROM employee e LEFT JOIN role r ON r.id = e.role_id LEFT JOIN department d ON d.id = r.department_id LEFT JOIN employee m ON m.id = e.manager_id ORDER BY ' + queryParam;

            connection.query(query, function (err, res) {
                console.log("\n")
                console.table(res)
                askWhatWant()
            })
        })
}

function addEmployee() {
    var query = "SELECT e.id, e.first_name, e.last_name, r.id AS role_id, r.title FROM employee e INNER JOIN role r ON e.role_id = r.id"
    connection.query(query, function (err, res) {
        if (err) throw err;
        let roleArray = []
        let managerArray = []
        res.forEach(res => {
            roleArray.push(`${res.role_id} ${res.title}`)
            managerArray.push(`${res.id} ${res.first_name} ${res.last_name}`)
        })

        return inquirer
            .prompt([
                {
                    name: "firstname",
                    type: "input",
                    message: "Employees first name: ",


                },
                {
                    name: "lastname",
                    type: "input",
                    message: "Employees last name: ",


                },
                {
                    name: "role",
                    type: "list",
                    message: "Employees role: ",
                    choices: roleArray

                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who will this employee report to: ",
                    choices: managerArray
                }

            ]).then(function (answer) {
                var first = JSON.stringify(answer.firstname)
                var last = JSON.stringify(answer.lastname)
                roleString = JSON.stringify(answer.role)
                roleId = roleString.charAt(1) + roleString.charAt(2)
                managerString = JSON.stringify(answer.manager)
                managerId = managerString.charAt(1) + managerString.charAt(2)

                var query = "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(" + first + "," + last + "," + roleId + "," + managerId + ")"
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log(`You have succesfully added a new employee`)

                    askWhatWant()
                })
            })
    })

}

function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        let departmentArray = [];
        res.forEach(res => {
            departmentArray.push(`${res.id} ${res.name}`)
        })

        inquirer
            .prompt([
                {
                    name: "roleName",
                    type: "input",
                    message: "What role would you like to create: ",


                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary for the role: ",


                },
                {
                    name: "department",
                    type: "list",
                    message: "What department is the role in: ",
                    choices: departmentArray
                }
            ]).then(function (answer) {
                var nameRole = JSON.stringify(answer.roleName)
                var salary = JSON.stringify(answer.salary)
                answerString = JSON.stringify(answer.department)
                id = answerString.charAt(1) + answerString.charAt(2)
                var query = "INSERT INTO role(title, salary, department_id) VALUES (" + nameRole + "," + salary + "," + id + ")"
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log(`You have succesfully added a new role`)
                    askWhatWant()
                })
            })
    })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Please give the new department a name: ",

            }

        ]).then(answer => {
            var nameString = JSON.stringify(answer.name)
            var query = "INSERT INTO department (name) VALUES (" + nameString + ")";
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log(`You have succesfully added a new department`)
                askWhatWant()
            })
        })
}

function deleteFunc() {
    inquirer
        .prompt([
            {
                name: "whatToDelete",
                type: "list",
                message: "What would you like to remove from the database",
                choices: [
                    "Employee",
                    "Role",
                    "Department"
                ]
            }
        ]).then(answer => {
            switch (answer.whatToDelete) {
                case "Employee":
                    deleteEmployee();
                    break;

                case "Role":
                    deleteRole();
                    break;

                case "Department":
                    deleteDepartment();
                    break;
            }
        })
}


function deleteEmployee() {
    connection.query("SELECT * FROM employee", function (err, result) {
        if (err) throw err;
        let employeeArray = []
        result.forEach(result => {
            employeeArray.push(`${result.id} ${result.first_name} ${result.last_name}`)
        })
        inquirer
            .prompt([
                {
                    name: "name",
                    type: "list",
                    message: "Which employee would you like to remove",
                    choices: employeeArray
                }
            ]).then(answer => {
                answerString = JSON.stringify(answer.name)
                id = answerString.charAt(1) + answerString.charAt(2)
                var query = "DELETE FROM employee WHERE id = " + id
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log(`You have succesfully removed an employee with the id ${id}`)
                    askWhatWant()
                })
            })

    })
}

function deleteDepartment() {
    connection.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
        let deparmentArray = []
        result.forEach(result => {
            deparmentArray.push(`${result.id} ${result.name}`)
        })
        inquirer
            .prompt([
                {
                    name: "name",
                    type: "list",
                    message: "Which department would you like to remove",
                    choices: deparmentArray
                }
            ]).then(answer => {
                answerString = JSON.stringify(answer.name)
                id = answerString.charAt(1) + answerString.charAt(2)
                var query = "DELETE FROM department WHERE id = " + id
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log(`You have succesfully removed an department`)

                })

                askWhatWant()
            })
    })
}

function deleteRole() {

    connection.query("SELECT * FROM role", function (err, result) {
        if (err) throw err;
        let roleArray = []
        result.forEach(result => {
            roleArray.push(`${result.id} ${result.title}`)
        })
        inquirer
            .prompt([
                {
                    name: "name",
                    type: "list",
                    message: "Which role would you like to remove",
                    choices: roleArray
                }
            ]).then(answer => {
                answerString = JSON.stringify(answer.name)
                id = answerString.charAt(1) + answerString.charAt(2)
                var query = "DELETE FROM role WHERE id = " + id
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log(`You have succesfully removed a role`)

                })

                askWhatWant()
            })
    })
}


function updateEmployee() {
    inquirer
        .prompt([
            {
                name: "update",
                type: "list",
                message: "What would you like to update",
                choices: [
                    "Role",
                    "Manager",
                    "Back"
                ]
            }
        ]).then(answer => {
            switch (answer.update) {
                case "Role":
                    updateRole();
                    break;

                case "Manager":
                    updateManager();
                    break;

                case "Back":
                    askWhatWant();
                    break;
            }
        })
}

function updateRole() {
    connection.query("SELECT * FROM employee", function (err, result) {
        if (err) throw err;
        let employeeArray = []
        result.forEach(result => {
            employeeArray.push(`${result.id} ${result.first_name} ${result.last_name}`)
        })
        connection.query("SELECT * FROM role", function (err, res) {
            if (err) throw err;
            let roleArray = []
            res.forEach(res => {
                roleArray.push(`${res.id} ${res.title}`)
            })
            inquirer
                .prompt([
                    {
                        name: "name",
                        type: "list",
                        message: "Which employee would you like to update",
                        choices: employeeArray
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "Which role would you like to change to",
                        choices: roleArray
                    }
                ]).then(answer => {

                    var answerString = JSON.stringify(answer.role)
                    var answerId = answerString.charAt(1) + answerString.charAt(2)
                    var employeeNameString = JSON.stringify(answer.name)
                    var employeeId = employeeNameString.charAt(1) + employeeNameString.charAt(2)

                    var query = `UPDATE employee SET role_id = ${answerId} WHERE id = ${employeeId}`
                    connection.query(query, function (err, res) {
                        if (err) throw err;
                        console.log(`You have succesfully updated a role`)
                    })
                    askWhatWant();
                })
        })
    })
}

function updateManager() {
    connection.query("SELECT * FROM employee", function (err, result) {
        if (err) throw err;
        let employeeArray = []
        result.forEach(result => {
            employeeArray.push(`${result.id} ${result.first_name} ${result.last_name}`)
        })
        inquirer
            .prompt([
                {
                    name: "name",
                    type: "list",
                    message: "Which employee would you like to update",
                    choices: employeeArray
                },
                {
                    name: "role",
                    type: "list",
                    message: "Who would you like to set as their manager",
                    choices: employeeArray
                }
            ]).then(answer => {

                var employeeString = JSON.stringify(answer.name)
                var managerString = JSON.stringify(answer.role)
                var employeeID = employeeString.charAt(1) + employeeString.charAt(2)
                var managerID = managerString.charAt(1) + managerString.charAt(2)


                connection.query(`UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`, (err, res) => {
                    if (err) return err;
                })
                askWhatWant();
            })
    })
}
