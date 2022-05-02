INSERT INTO department (name)
VALUES  ("Tech"),
        ("Marketing"),
        ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES  ("Software Engineer", 100000.00, 1),
        ("Marketing Coordinator", 70000.00, 2),
        ("Sales Rep", 50000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Kelly", "Smith", 1, 1),
        ("Dylan", "Green", 3, 1),
        ("Michelle", "Collilns", 2, 2),
        ("Sydney", "Sheppard", 1, 4);