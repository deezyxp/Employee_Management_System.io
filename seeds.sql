USE employee_db;

INSERT INTO department (name)
VALUES ("Sales"), ("Warehouse"), ("Marketing"), ("HR"), ("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES
("Sales Manager", 150000, 1),
("Sales Rep", 85000, 1),
("Warehouse Manager", 100000, 2),
("Warehouse Rep", 80000, 2),
("Marketing Manager", 70000, 3),
("Marketing Rep", 65000, 3),
("HR Manager", 65000, 4),
("HR Rep", 45000, 4),
("Accounting Manager", 95000, 5),
("Accounting Rep", 55000, 5)
;

INSERT INTO employee (first_name, last_name, role_id)
VALUES
("Daniel", "Zhang", 1),
("Michelle", "Nguyen", 2),
("Mike", "Strong", 3),
("Sam", "Gamgee", 4),
("Ron", "Weasley", 5),

