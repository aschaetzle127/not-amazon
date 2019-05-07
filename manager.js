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

function forSale() {
    console.log(
        chalk.blue(
            "\n" +
            "Welcome to Your Current Inventory" +
            "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" +
            "\n"
        )
    );
    connection.query(
        "SELECT id, product_name, department_name, price, stock_quantity FROM products ORDER BY id DESC",
        function (err, result) {
            if (err) throw err;
            console.table(result);
        }
    );
    connection.end();

}

function lowInvent() {
    console.log(
        chalk.magenta(
            "\n" +
            "Okay! Here are the items that are low in inventory." +
            "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" +
            "\n"
        )
    );
    connection.query(
        "SELECT id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 10 ORDER BY stock_quantity DESC",
        function (err, result) {
            if (err) throw err;
            console.table(result);
        }
    );
    connection.end();

}

function addInvent() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemId",
            message: "Please enter the ID of the item you would like to change.",
        }, {
            type: "input",
            name: "quantity",
            message: "Please enter the amount of inventory you would like to add."
        }
    ]).then(function (input) {

        connection.query("SELECT * FROM products WHERE ?", { id: input.itemId }, function (err, results) {
            if (err) throw err;

            if (results.length === 0) {
                console.log("That item does not seem to exist, please try again!");
                addInvent();
            } else {
                let currentItem = results[0];

                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: parseInt(currentItem.stock_quantity) + parseInt(input.quantity)
                }, {
                    id: input.itemId
                }], function (err, results) {
                    if (err) throw err;
                    console.log(chalk.green("Success! \n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"))
                    console.log(chalk.green("Item ID: " + input.itemId + " Updated to: " + (parseInt(currentItem.stock_quantity) + parseInt(input.quantity))));
                })

                connection.end();
            }
        })
    })
}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: 'productName',
            message: "Please enter the name of the product: "
        }, {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the department: '
        }, {
            type: 'input',
            name: 'departmentID',
            message: 'Enter the corresponding department ID: '
        }, {
            type: 'input',
            name: 'price',
            message: 'Enter the price of the item: '
        }, {
            type: 'input',
            name: 'stockQuantity',
            message: 'Enter the amount of stock: '
        }
    ]).then(function (input) {
        connection.query("INSERT INTO products SET ?",
            {
                product_name: input.productName,
                department_name: input.departmentName,
                department_id: input.departmentID,
                price: input.price,
                stock_quantity: input.stockQuantity
            },
            function (err, results) {
                console.log(chalk.green("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \nSUCCESS!"))
                console.log(chalk.cyan("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \nThe " + input.productName + " has been added to the " + input.departmentName + " department at a price of $" + input.price + ", with a total of " + input.stockQuantity + " units in stock. \n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"))
                mgrSelection();
            })
    })
}

function terminate() {
    console.log(chalk.yellow("OKAY! Have a wonderful day! \nGOODBYE!!"));
    connection.end();
}