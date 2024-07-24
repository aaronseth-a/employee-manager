const express = require('express');
const mysql = require('mysql2');

const { mainmenu } = require('./db/dbmanagers.js');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Bt2#6rrmV*8gr3#',
        database: 'company_db'
    },

    console.log("Connected to company_db database.\n")
);


mainmenu(db);
