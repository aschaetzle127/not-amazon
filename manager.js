const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
require("console.table");
var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "Hpesoj127!",
    database: "not_amazon_db"
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId);

    mgrSelection();
});

function mgrSelection() {
    inquirer.prompt({
        type: "list",
        name: "whatDo",
        message: chalk.green("Hello, what would you like to do today?"),
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Leave Program"
        ]
    }).then(function (answer) {
        switch (answer.whatDo) {
            case "View Products for Sale":
                forSale();
                break;

            case "View Low Inventory":
                lowInvent();
                break;

            case "Add to Inventory":
                addInvent();
                break;
            case "Add New Product":
                addProduct();
                break;

            case "Leave Program":
                terminate();
                break;

        }
    });
}

function forSale() { }

function lowInvent() { }

function addInvent() { }

function addProduct() { }

function terminate() { }