INSERT INTO department (name)
VALUES  ("Tech"),
        ("Marketing"),
        ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES  ("Software Engineer", 100000.00, 1),
        ("Marketing Coordinator", 70000.00, 2),
        ("Sales Rep", 50000.00, 3),
        ("Marketing Strategiest", 125000.00, 2),
        ("Lead Engineer", 150000.00, 1),
        ("Sales Lead", 120000, 3);

-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES  ("Dylan", "Green", 5, 1),
--         ("Sydney", "Sheppard", 1, 1),
--         ("Alex", "Fields", 6, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Kelly", "Smith", 1, 1),
        ("Dylan", "Green", 3, 6),
        ("Michelle", "Collilns", 2, 4),
        ("Sydney", "Sheppard", 1, 1);