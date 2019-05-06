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

//connection test

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId);

    start();
});

//Inquirer functions

function start() {
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "confirm",
                message: chalk.bold.blue(
                    "Welcome to Not_Amazon! \n\nWould you like to view our inventory?"
                ),
                default: true
            }
        ])
        .then(answers => {
            if (answers.confirm === true) {
                inventoryList();
            } else {
                console.log(chalk.red("Okay, BYE!"));
                connection.end();
            }
        });
}

function purchasePrompt() {
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "purchase",
                message: chalk.cyan("\n Would you like to make a purchase? \n"),
                default: true
            }
        ])
        .then(answers => {
            if (answers.purchase === true) {
                whichOnePrompt();
            } else {
                console.log(chalk.red("Okay! Have a great day! BYE!"));
                connection.end();
            }
        });
}

function whichOnePrompt() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        {
            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "itemId",
                        message: "Please enter the ID of the product would you like to buy.",
                    },
                    {
                        type: "input",
                        name: "itemQuantity",
                        message:
                            "Please enter the amount of this item you would like to purchase.",
                    }
                ])
                .then(function (input) {
                    connection.query("SELECT * FROM products WHERE ?", { id: input.itemId }, function (err, results) {
                        if (err) throw err;
                        if (results.length === 0) {
                            console.log(chalk.red("I am sorry, there has been an error.  Please try again!"));
                            start();
                        } else {
                            var product = results[0];
                            if (product.stock_quantity > input.itemQuantity) {
                                connection.query(
                                    "UPDATE products SET ? WHERE ?", [{
                                        stock_quantity: parseInt(product.stock_quantity - input.itemQuantity)
                                    }, {
                                        id: input.itemId
                                    }],
                                    function (error, result) {
                                        if (error) throw err;
                                        console.log(chalk.green("Purchase successful!!" + "\nYour total is: $ " + product.price * input.itemQuantity + "!" + "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));
                                        connection.end();
                                    }
                                )
                            } else {
                                console.log(chalk.red("Sorry! That is more than we have in stock. Please try again."));
                                start();
                            }
                        }
                    });
                });
        };
    });
}


//Other functions

function inventoryList() {
    console.log(
        chalk.green(
            "\n" +
            "GREAT!!! Let's see what is available!" +
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

    purchasePrompt();

    //   connection.end();
}
