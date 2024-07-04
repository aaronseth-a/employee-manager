DROP DATABASE IF EXIST company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE departments (
    id INT PRIMARY KEY,
    name VARCHAR(30)  
);

CREATE TABLE roles (
    id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL, 
    departmentId INT
);

CREATE TABLE employees (
    id INT PRIMARY KEY,
    firstName VARCHAR(30),
    lastName VARCHAR(30),
    roleId INT,
    managerId INT
);

