INSERT INTO departments (name)
VALUES ("Finance"),
    ("Legal"),
    ("Sales"),
    ("Science");

INSERT INTO roles (title, salary, departmentId)
VALUES ('Director', 80000.00, 1),
    ('Assistant', 50000.00, 2),
    ('Sales Person', 30000.00, 3),
    ('Lead Engineer', 70000.00, 4),
    ('Marketer', 60000.00, 3);

INSERT INTO employees (firstName,lastName,roleId,managerId)
VALUES ("Warren","Buffet", 1, NULL),
    ("Julie","Andrews", 2, 1),
    ("Mark","Hamill", 3, 1),
    ("Elon","Musk", 4, NULL);